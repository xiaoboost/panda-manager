import { gzip, gunzip, readFile, writeFile } from './utils';
import { debounce, AnyObject } from '@xiao-ai/utils';

/** 数据库文件在文件系统中的储存结构 */
interface DatabaseInFile {
  version: string;
  data: Record<string, AnyObject[]>;
}

/** 基础数据行 */
type TableRowData<T extends AnyObject> = T & { id: number };
/** 行数据 */
type RowData<Data extends AnyObject> = Readonly<TableRowData<Data>>;

/** 数据行 */
export class TableRow<Data extends AnyObject = AnyObject> {
  /** 原始数据 */
  private _data: TableRowData<Data>;

  constructor(id: number, data: Data) {
    this._data = {
      ...data,
      id,
    };
  }

  /** 编号 */
  get id() {
    return this._data.id;
  }

  /** 数据 */
  get data(): Readonly<TableRowData<Data>> {
    return this._data as any;
  }

  /** 设置数据 */
  set(data: Partial<Data>) {
    this._data = {
      ...this._data,
      ...data,
    };
  }
}

/** 数据表 */
export class Table<Row extends AnyObject = AnyObject> {
  /** 按照哪列排序 */
  private _orderBy: keyof RowData<Row> = 'id';
  /** 查询条件回调 */
  private _whereCb: Array<(data: RowData<Row>) => boolean> = [];
  /** 是否是升序排列 */
  private _isAsc = true;
  /** 设置查询的数量 */
  private _limit = Infinity;
  /** 数据表 */
  private _data: TableRow<Row>[] = [];
  /** 当前最大编号 */
  private _maxId = 1;

  /** 数据库 */
  private readonly _database: Database;

  constructor(database: Database) {
    this._database = database;
  }

  /** 是否准备好 */
  get ready() {
    return this._database.ready;
  }

  /** 复制当前的数据表类 */
  private _shadowTable() {
    // 新数据表
    const table = new Table<Row>(this._database);

    // 直接引用原数据表数据
    table['_data'] = this._data;

    // 复制内部查询条件
    table._limit = this._limit;
    table._isAsc = this._isAsc;
    table._orderBy = this._orderBy;
    table._whereCb = this._whereCb.slice();

    return table;
  }
  /** 生成排序回调 */
  private _createSort() {
    const large = this._isAsc ? 1 : -1;
    const small = -large;
    const key = this._orderBy;

    return (pre: TableRow<Row>, next: TableRow<Row>) => {
      return pre.data[key] > next.data[key] ? large : small;
    };
  }

  /** 添加条目 */
  insert(...list: Row[]): TableRow<Row>[] {
    const startIndex = this._data.length;

    for (const data of list) {
      this._data.push(new TableRow(this._maxId++, data));
    }

    this._database.write();

    return this._data.slice(startIndex);
  }
  /** 删除条目 */
  remove() {
    const { _data: table, _limit: limit, _whereCb: assert } = this;

    let count = 0;

    for (let index = 0; index < table.length; index++) {
      // 表中的原数据
      const row = table[index];

      // 删除之后的下表指针对应的元素赋值
      table[index - count] = row;

      // 删除计数还未到限制
      if (count < limit) {
        if (assert.every((cb) => cb(row.data))) {
          count++;
        }
      }
    }

    // 表长度重新赋值
    table.length -= count;

    this._database.write();
  }
  /** 修改条目 */
  update(id: number, data: Partial<Row>) {
    const row = this._data.find((item) => item.id === id);

    if (row) {
      row.set(data);
      this._database.write();
    }
  }
  /** 查询数据 */
  toQuery() {
    let selected: TableRow<Row>[] = [];

    // 没有查询条件，则返回全部数据
    if (this._whereCb.length === 0) {
      selected = this._data.slice();
    }
    // 有查询条件则搜索
    else {
      for (let i = 0; i < this._data.length; i++) {
        const row = this._data[i];

        if (this._whereCb.every((cb) => cb(row.data))) {
          selected.push(row);

          if (selected.length >= this._limit) {
            break;
          }
        }
      }
    }

    return selected.sort(this._createSort());
  }

  // 查询条件
  /** 设置查询条件 */
  where(assert: (data: RowData<Row>) => boolean) {
    const table = this._shadowTable();

    if (table._whereCb.indexOf(assert) < 0) {
      table._whereCb.push(assert);
    }

    return table;
  }
  /** 设置排序 */
  orderBy(key: keyof RowData<Row>, direction: 'desc' | 'asc' = 'asc') {
    const table = this._shadowTable();

    table._orderBy = key;
    table._isAsc = direction === 'asc';

    return table;
  }
  /** 设置查询数量 */
  limit(num: number) {
    const table = this._shadowTable();
    table._limit = num;
    return table;
  }
}

/** 数据库 */
export class Database {
  /** 当前数据版本 */
  private _version = process.env.VERSION;
  /** 数据库储存的路径 */
  private _path: string;
  /** 数据库数据 */
  private _data: Record<string, Table> = {};
  /** 初始化准备就绪 */
  private _ready: Promise<void>;

  constructor(path: string) {
    this._path = path;
    this._ready = this.init();
  }

  /** 储存路径 */
  private get path() {
    return process.env.NODE_ENV === 'development' ? `${this._path}.json` : this._path;
  }

  get ready() {
    return this._ready;
  }

  /** 写入硬盘 */
  private async _write() {
    const data: DatabaseInFile = {
      version: this._version,
      data: {},
    };

    Object.entries(this._data).forEach(([name, table]) => {
      data.data[name] = table['_data'].map((row) => row.data);
    });

    if (process.env.NODE_ENV === 'production') {
      await writeFile(this.path, await gzip(JSON.stringify(data)));
    } else {
      await writeFile(this.path, JSON.stringify(data, null, 2));
    }
  }
  /** 初始化 */
  async init(): Promise<void> {
    let data: DatabaseInFile = {
      version: this._version,
      data: {},
    };

    try {
      let buf = await readFile(this.path);

      if (process.env.NODE_ENV === 'production') {
        buf = await gunzip(buf);
      }

      const dataInDisk = JSON.parse(buf.toString()) as DatabaseInFile;

      if (data.version !== dataInDisk.version) {
        // FIXME: 升级数据
      }

      data = dataInDisk;
    } catch (err) {
      this.write();
    }

    Object.entries(data.data).forEach(([name, tableData]) => {
      this.use(name).insert(...tableData);
    });
  }

  /**
   * 写入硬盘
   *  - 延迟 200 ms
   */
  write = debounce(() => this._write(), 200);

  /** 使用某个表 */
  use<Row extends AnyObject = AnyObject>(name: string): Table<Row> {
    if (!this._data[name]) {
      this._data[name] = new Table(this);
    }

    return this._data[name] as any;
  }
}
