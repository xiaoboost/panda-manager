import * as zlib from 'zlib';

import { promisify } from 'util';
import { readFile, writeFile } from 'fs-extra';
import { uid, debounce, resolveTempDir, Subject } from 'utils/shared';

/** 数据库文件实体路径 */
const databsePath = resolveTempDir('database');

/** 基础数据行 */
type TableRowData<T extends object> = T & { id: number };
/** 数据库文件在文件系统中的储存结构 */
type DatabaseInFile = Record<string, object[]>;

/** gzip Promise 包装 */
const gzip = promisify<zlib.InputType, Buffer>(zlib.gzip);
const gunzip = promisify<zlib.InputType, Buffer>(zlib.gunzip);

/** 数据行类 */
class TableRow<Map extends object> extends Subject {
    /** 原始数据 */
    private _data: TableRowData<Map>;
    /** 只读的代理数据 */
    private _readOnly: Readonly<TableRowData<Map>>;

    /** 对外暴露数据副本 */
    get data(): Readonly<TableRowData<Map>> {
        return this._readOnly;
    }

    constructor(data: Map) {
        super();

        this._data = {
            ...data,
            id: uid(),
        };

        this._readOnly = new Proxy(this._data, {
            get: (target, prop) => target[prop],
        });
    }

    /** 设置数据 */
    set(data: Partial<Map>) {
        const lastData = this.data;

        this._data = {
            ...this._data,
            ...data,
        };

        this.notify('change', this.data, lastData);
    }
}

/** 数据表类 */
class Table<Map extends object = object> extends Subject {
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
    /** 数据表数据 */
    private readonly _data: TableRow<Map>[] = [];

    /** 复制当前的数据表类 */
    private _shadowTable() {
        // 新数据表
        const table = new Table<Map>(this._database);

        // 直接引用原数据表数据
        Object.defineProperty(table, '_data', this._data);

        // 复制内部查询条件
        table._limit = this._limit;
        table._isAsc = this._isAsc;
        table._orderBy = this._orderBy;
        table._whereCb = this._whereCb.slice();

        return table;
    }
    /** 生成排序回调 */
    private _sort() {
        const large = this._isAsc ? 1 : -1, small = -large, key = this._orderBy;

        return (pre: TableRow<Map>, next: TableRow<Map>) => {
            return pre.data[key] > next.data[key] ? large : small;
        };
    }

    /** 隶属的数据库 */
    constructor(database: Database) {
        super();
        this._database = database;
    }

    /** 添加条目 */
    insert(data: Map) {
        this._data.push(new TableRow(data));
        this._database.writeDisk();
    }
    /** 删除条目 */
    remove() {
        const {
            _data: table,
            _limit: limit,
            _whereCb: assert,
        } = this;

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

        this._database.writeDisk();
    }
    /** 修改条目 */
    update(id: number, data: Partial<Map>) {
        const row = this._data.find((item) => item.data.id === id);

        if (!row) {
            return false;
        }

        row.set(data);

        this._database.writeDisk();

        return true;
    }
    /** 查询数据 */
    toQuery() {
        const selected: TableRow<Map>[] = [];

        for (let i = 0; i < this._data.length; i++) {
            const item = this._data[i];

            if (this._whereCb.every((cb) => cb(item.data))) {
                selected.push(item);

                if (selected.length >= this._limit) {
                    break;
                }
            }
        }

        return selected.sort(this._sort());
    }

    // 查询条件
    /** 设置查询条件 */
    where(assert: (data: TableRowData<Map>) => boolean) {
        const table = this._shadowTable();

        if (table._whereCb.indexOf(assert) < 0) {
            table._whereCb.push(assert);
        }

        return Table;
    }
    /** 设置排序 */
    orderBy(key: keyof TableRowData<Map>, direction: 'desc' | 'asc' = 'asc') {
        const table = this._shadowTable();

        table._orderBy = key;
        table._isAsc = direction === 'asc';

        return Table;
    }
    /** 设置查询数量 */
    limit(num: number) {
        const Table = this._shadowTable();

        Table._limit = num;

        return Table;
    }
}

/** 数据库类 */
class Database {
    /** 当前异步进程 */
    private _progress = Promise.resolve();
    /** 数据库数据 */
    private _data: Record<string, Table> = {};

    constructor() {
        this.readDisk();
    }

    /** 数据写入硬盘 */
    private _writeDisk() {
        this._progress = this._progress.then(async () => {
            const data: DatabaseInFile = {};

            Object.entries(this._data).forEach(([name, table]) => {
                data[name] = table['_data'].map((row) => row['_data']);
            });

            await writeFile(databsePath, await gzip(JSON.stringify(data)));
        });

        return this._progress;
    }

    /** 将数据库写入硬盘 */
    writeDisk = debounce(200, () => this._writeDisk());
    /** 从硬盘读取数据 */
    readDisk() {
        this._progress = this._progress.then(async () => {
            let data: DatabaseInFile = {};

            try {
                const buf = await gunzip(await readFile(databsePath));

                debugger;
                data = JSON.parse(buf.toString());
            }
            catch (err) {
                console.error(err);
                this.writeDisk();
            }

            Object.entries((data)).forEach(([name, tableData]) => {
                const table = this.use(name);
                tableData.forEach((item) => table['_data'].push(new TableRow(item)));
            });
        });

        return this._progress;
    }

    /** 使用某个表 */
    use<Map extends object = object>(name: string): Table<Map> {
        if (!this._data[name]) {
            this._data[name] = new Table(this);
        }

        return this._data[name] as any;
    }
}

export default new Database();
