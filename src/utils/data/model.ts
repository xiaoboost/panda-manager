import { isObject } from 'src/utils/shared/assert';
import { gzip, gunzip } from 'src/utils/node/zlib';
import { readFile, writeFile } from 'src/utils/node/file-system';
import { debounce } from 'src/utils/shared/func';
import { isUndef, isDef } from 'src/utils/shared/assert';

export class Model<T> {
    /** 数据 */
    private _val: T;
    /** 代理数据 */
    private _proxy!: T;
    /** 数据在硬盘储存的路径 */
    private _path: string;
    /** 初始化完成 */
    private _ready = Promise.resolve();

    get data() {
        return this._proxy;
    }
    set data(val) {
        if (this._val !== val) {
            this._val = val;
            this.write();
            this.proxy();
        }
    }

    get ready() {
        return this._ready;
    }

    get path() {
        return process.env.NODE_ENV === 'development'
            ? `${this._path}.json`
            : this._path;
    }

    constructor(init: T, path: string) {
        this._val = init;
        this._path = path;
        this.read();
        this.proxy();
    }

    private proxy() {
        if (isObject(this._val)) {
            this._proxy = new Proxy(this._val, {
                set: (target, key, val) => {
                    const result = Reflect.set(target, key, val);

                    this.write();

                    return result;
                },
            });
        }
        else {
            this._proxy = this._val;
        }
    }

    private async _write() {
        if (process.env.NODE_ENV === 'development') {
            await writeFile(this.path, JSON.stringify(this._val, null, 2));
        }

        if (process.env.NODE_ENV === 'production') {
            await writeFile(this.path, await gzip(JSON.stringify(this._val)));
        }
    }

    read() {
        this._ready = new Promise(async (resolve) => {
            try {
                let buf = await readFile(this.path);

                if (process.env.NODE_ENV === 'production') {
                    buf = await gunzip(buf);
                }

                this.data = JSON.parse(buf.toString());
            }
            catch (err) {
                this.write();
            }

            resolve();
        });
    }

    write = debounce(200, () => this._write());

    fill(val: T) {
        const { data } = this;

        Object.entries(val).forEach(([key, val]) => {
            if (isUndef(data[key]) && isDef(val)) {
                data[key] = val;
            }
        });
    }
}
