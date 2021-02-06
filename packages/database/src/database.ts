import { gzip, gunzip } from './utils';
import { readFile, writeFile } from '@panda/fs';
import { uid, debounce, Watcher, AnyObject } from '@panda/utils';

/** 基础数据行 */
type TableRowData<T extends AnyObject> = T & { id: number };
/** 数据库文件在文件系统中的储存结构 */
type DatabaseInFile = Record<string, AnyObject[]>;

/** 生成编号 */
const newId = ({ id }: { id?: any }) => {
  if (!id) {
    return uid();
  }

  const oldId = Number(id);
  return Number.isNaN(oldId) ? uid() : oldId;
};

/** 数据行类 */
class TableRow<Map extends AnyObject> extends Watcher<TableRowData<Map>> {
  constructor(data: Map & { id?: any }) {
    super({
      ...data,
      id: newId(data),
    });
  }

  /** 设置数据 */
  set(data: Partial<Map>) {
    const lastData = this.data;

    this._data = {
      ...this._data,
      ...data,
    };

    this.notify(this.data, lastData);
  }
}

/** 数据表类 */
class Table<Map extends AnyObject = AnyObject> extends Watcher<TableRow<Map>[]> {
  /** 按照哪列排序 */
  private _orderBy: keyof TableRowData<Map> = 'id';
  /** 查询条件回调 */
  private _whereCb: Array<(data: Readonly<TableRowData<Map>>) => boolean> = [];
  /** 是否是升序排列 */
  private _isAsc = true;
  /** 设置查询的数量 */
  private _limit = Infinity;

  /** 数据库 */
  private readonly _database: Database;

  /** 复制当前的数据表类 */
  private _shadowTable() {
    // 新数据表
    const table = new Table<Map>(this._database);

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
  private _sort() {
    const large = this._isAsc ? 1 : -1,
      small = -large,
      key = this._orderBy;

    return (pre: TableRow<Map>, next: TableRow<Map>) => {
      return pre.data[key] > next.data[key] ? large : small;
    };
  }

  /** 隶属的数据库 */
  constructor(database: Database) {
    super([]);
    this._database = database;
  }

  get ready() {
    return this._database.ready;
  }

  /** 添加条目 */
  insert(...data: Map[]) {
    const last = this._data.slice();

    this._data.push(...data.map((item) => new TableRow(item)));
    this._database.write();

    this.notify(this._data, last);
  }
  /** 删除条目 */
  remove() {
    const { _data: table, _limit: limit, _whereCb: assert } = this;

    const last = this._data.slice();

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
    this.notify(this._data, last);
  }
  /** 修改条目 */
  update(id: number, data: Partial<Map>) {
    const row = this._data.find((item) => item.data.id === id);

    if (!row) {
      return false;
    }

    row.set(data);

    this._database.write();

    return true;
  }
  /** 查询数据 */
  toQuery() {
    let selected: TableRow<Map>[] = [];

    // 没有查询条件，则返回全部数据
    if (this._whereCb.length === 0) {
      selected = this._data.slice();
    }
    // 有查询条件则搜索
    else {
      for (let i = 0; i < this._data.length; i++) {
        const item = this._data[i];

        if (this._whereCb.every((cb) => cb(item.data))) {
          selected.push(item);

          if (selected.length >= this._limit) {
            break;
          }
        }
      }
    }

    return selected.sort(this._sort());
  }

  // 查询条件
  /** 设置查询条件 */
  where(assert: (data: Readonly<TableRowData<Map>>) => boolean) {
    const table = this._shadowTable();

    if (table._whereCb.indexOf(assert) < 0) {
      table._whereCb.push(assert);
    }

    return table;
  }
  /** 设置排序 */
  orderBy(key: keyof TableRowData<Map>, direction: 'desc' | 'asc' = 'asc') {
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

/** 数据库类 */
export class Database {
  /** 数据库储存的路径 */
  private _path: string;
  /** 当前异步进程 */
  private _progress = Promise.resolve();
  /** 数据库数据 */
  private _data: Record<string, Table> = {};
  /** 初始化准备就绪 */
  private _ready: Promise<void>;

  constructor(path: string) {
    this._path = path;
    this._ready = this.read();
  }

  private get path() {
    return process.env.NODE_ENV === 'development'
      ? `${this._path}.json`
      : this._path;
  }

  get ready() {
    return this._ready;
  }

  /** 数据写入硬盘 */
  private _write() {
    this._progress = this._progress.then(async () => {
      const data: DatabaseInFile = {};

      Object.entries(this._data).forEach(([name, table]) => {
        data[name] = table['_data'].map((row) => row['_data']);
      });

      if (process.env.NODE_ENV === 'development') {
        await writeFile(this.path, JSON.stringify(data, null, 2));
      }

      if (process.env.NODE_ENV === 'production') {
        await writeFile(this.path, await gzip(JSON.stringify(data)));
      }
    });

    return this._progress;
  }
  /** 从硬盘读取数据 */
  async read(): Promise<void> {
    let data: DatabaseInFile = {};

    try {
      let buf = await readFile(this.path);

      if (process.env.NODE_ENV === 'production') {
        buf = await gunzip(buf);
      }

      data = JSON.parse(buf.toString());
    }
    catch (err) {
      this.write();
    }

    Object.entries(data).forEach(([name, tableData]) => {
      this.use(name).insert(...tableData);
    });
  }

  /** 将数据库写入硬盘 */
  write = debounce(200, () => this._write());

  /** 使用某个表 */
  use<Map extends AnyObject = AnyObject>(name: string): Table<Map> {
    if (!this._data[name]) {
      this._data[name] = new Table(this);
    }

    return this._data[name] as any;
  }
}
