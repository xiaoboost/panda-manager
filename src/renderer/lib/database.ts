import * as zlib from 'zlib';

import { promisify } from 'util';
import { readFile, writeFile } from 'fs-extra';
import { uid, debounce, resolveTempDir } from 'utils/shared';

/** 数据库文件实体路径 */
const databsePath = resolveTempDir('database');

/** 基础数据行 */
type TableRowData<T extends object> = T & { id: number };

/** gzip Promise 包装 */
const gzip = promisify<zlib.InputType, Buffer>(zlib.gzip);
const gunzip = promisify<zlib.InputType, Buffer>(zlib.gunzip);

/**  */

/** 数据行类 */
class TableRow {

}

/** 数据表类 */
class Table<Map extends object = object> {
    /** 按照哪列排序 */
    private _orderBy: keyof TableRowData<Map> = 'id';
    /** 查询条件回调 */
    private _whereCb: Array<(data: TableRowData<Map>) => boolean> = [];
    /** 是否是升序排列 */
    private _isAsc = true;
    /** 设置查询的数量 */
    private _limit = Infinity;

    /** 数据库 */
    private readonly _database: Database;
    /** 数据表数据 */
    private readonly _data: TableRowData<Map>[] = [];

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

        return (pre: TableRowData<Map>, next: TableRowData<Map>) => {
            return pre[key] > next[key] ? large : small;
        };
    }

    /** 隶属的数据库 */
    constructor(database: Database) {
        this._database = database;
    }

    /** 添加条目 */
    insert(data: Map) {
        this._data.push({
            ...data,
            id: uid(),
        });

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
                if (assert.every((cb) => cb(row))) {
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
        const row = this._data.find((item) => item.id === id);

        if (!row) {
            return false;
        }

        Object.keys(row).forEach((key) => {
            if (key in data) {
                row[key] = data[key];
            }
        });

        this._database.writeDisk();

        return true;
    }
    /** 查询数据 */
    toQuery() {
        const selected: Table<Map>['_data'] = [];

        for (let i = 0; i < this._data.length; i++) {
            const item = this._data[i];

            if (this._whereCb.every((cb) => cb(item))) {
                selected.push(item);

                if (selected.length >= this._limit) {
                    break;
                }
            }
        }

        return selected.sort(this._sort()).map((item) => ({ ...item }));
    }

    // 查询条件
    /** 设置查询条件 */
    where(assert: (data: TableRowData<Map>) => boolean) {
        const Table = this._shadowTable();

        if (Table._whereCb.indexOf(assert) < 0) {
            Table._whereCb.push(assert);
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
            const data: Record<string, object> = {};

            Object.entries(this._data).forEach(([name, table]) => {
                data[name] = table['_data'];
            });

            await writeFile(databsePath, await gzip(JSON.stringify(data)));
        });

        return this._progress;
    }

    /** 对外暴露的写硬盘接口 */
    writeDisk = debounce(200, () => this._writeDisk());
    /** 从硬盘读取数据 */
    readDisk() {
        this._progress = this._progress.then(async () => {
            try {
                const buf = await gunzip(await readFile(databsePath));

                debugger;
                this._data = JSON.parse(buf.toString());
            }
            catch (err) {
                debugger;
                console.error(err);
                this._data = {};
                this.writeDisk();
            }

            Object.entries((this._data)).forEach(([name, tableData]) => {
                const table = this.use(name);

                Object.defineProperty(table, '_data', {
                    enumerable: false,
                    writable: false,
                    value: tableData,
                });
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
