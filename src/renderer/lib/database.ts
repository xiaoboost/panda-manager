import { uid } from 'utils/shared';

/** 基础数据行 */
type DataBaseRow<T extends object> = T & { id: number };

/** 数据库类 */
export default class Database<Map extends object> {
    /** 按照哪列排序 */
    private _orderBy: keyof DataBaseRow<Map> = 'id';
    /** 当前已经选取的数据列 */
    private _selected: Array<keyof DataBaseRow<Map>> = [];
    /** 查询条件回调 */
    private _whereCb: Array<(data: DataBaseRow<Map>) => boolean> = [];
    /** 是否是升序排列 */
    private _isAsc = true;
    /** 设置查询的数量 */
    private _limit = Infinity;

    /** 数据库数据 */
    private _data: DataBaseRow<Map>[] = [];

    /** 复制当前的数据库类 */
    private _shadowDatabase() {
        // 新数据库
        const database = new Database<Map>();

        // 复制内部查询条件
        database._data = this._data;
        database._limit = this._limit;
        database._isAsc = this._isAsc;
        database._orderBy = this._orderBy;
        database._whereCb = this._whereCb.slice();
        database._selected = this._selected.slice();

        return database;
    }
    /** 生成截取数据列的函数 */
    private _select<K extends keyof DataBaseRow<Map>>() {
        type SelectData = Pick<DataBaseRow<Map>, K>;

        return (data: DataBaseRow<Map>): SelectData => {
            const result: SelectData = {} as any;

            this._selected.forEach((key) => {
                result[key as any] = data[key];
            });

            return result;
        };
    }
    /** 生成排序回调 */
    private _sort() {
        const large = this._isAsc ? 1 : -1, small = -large, key = this._orderBy;

        return (pre: DataBaseRow<Map>, next: DataBaseRow<Map>) => {
            return pre[key] > next[key] ? large : small;
        };
    }

    /** 添加条目 */
    insert(data: Map) {
        this._data.push({
            ...data,
            id: uid(),
        });
    }
    /** 删除条目 */
    remove() {
        let count = 0;

        this._data = this._data.filter((data) => {
            if (count > this._limit) {
                return true;
            }

            const isDelete = this._whereCb.every((cb) => cb(data));

            if (isDelete) {
                count++;
            }

            return !isDelete;
        });
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

        return true;
    }
    /** 查询数据 */
    toQuery<K extends keyof DataBaseRow<Map> = keyof DataBaseRow<Map>>() {
        const selected: Database<Map>['_data'] = [];

        for (let i = 0; i < this._data.length; i++) {
            const item = this._data[i];

            if (this._whereCb.every((cb) => cb(item))) {
                selected.push(item);

                if (selected.length >= this._limit) {
                    break;
                }
            }
        }

        return selected.sort(this._sort()).map(this._select<K>());
    }

    // 查询条件
    /** 选择输出的数据列 */
    select(...keys: Array<keyof DataBaseRow<Map>>) {
        const database = this._shadowDatabase();

        keys.forEach((key) => {
            if (database._selected.indexOf(key) < 0) {
                database._selected.push(key);
            }
        })

        return database;
    }
    /** 设置查询条件 */
    where(assert: (data: DataBaseRow<Map>) => boolean) {
        const database = this._shadowDatabase();

        if (database._whereCb.indexOf(assert) < 0) {
            database._whereCb.push(assert);
        }

        return database;
    }
    /** 设置排序 */
    orderBy(key: keyof DataBaseRow<Map>) {
        const database = this._shadowDatabase();

        database._orderBy = key;

        return database;
    }
    /** 设置查询数量 */
    limit(num: number) {
        const database = this._shadowDatabase();

        database._limit = num;

        return database;
    }
}
