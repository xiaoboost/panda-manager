import { isObject } from 'src/utils/shared/assert';
import { gzip, gunzip } from 'src/utils/node/zlib';
import { readFile, writeFile } from 'src/utils/node/file-system';

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

    constructor(init: T, path: string) {
        this._val = init;
        this._path = path;
        this.read();
        this.proxy();
    }

    private read() {
        this._ready = new Promise(async (resolve) => {
            try {
                const buf = await gunzip(await readFile(this._path));
                this._val = JSON.parse(buf.toString());
            }
            catch (err) {
                await this.write();
            }

            resolve();
        });
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

    private async write() {
        await writeFile(this._path, await gzip(JSON.stringify(this._val)));
    }
}
