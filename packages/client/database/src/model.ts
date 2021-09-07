import { gzip, gunzip, readFile, writeFile } from './utils';
import { debounce, DeepReadonly, isUndef, isDef } from '@xiao-ai/utils';

/** 数据储存 */
export class Model<T> {
  /** 数据 */
  private _val: T;
  /** 初始化完成 */
  private _ready = Promise.resolve();
  /** 数据在硬盘储存的路径 */
  private readonly _path: string;

  constructor(init: T, path: string) {
    this._val = init;
    this._path = path;
    this._ready = this.init();
  }

  /** 储存数据 */
  get data(): DeepReadonly<T> {
    return this._val as any;
  }

  /** 初始化完成 */
  get ready() {
    return this._ready;
  }

  /** 数据储存路径 */
  private get path() {
    return process.env.NODE_ENV === 'development' ? `${this._path}.json` : this._path;
  }

  /** 写入硬盘 */
  private async _write() {
    await this._ready;

    if (process.env.NODE_ENV === 'production') {
      await writeFile(this.path, await gzip(JSON.stringify(this._val)));
    }
    else {
      await writeFile(this.path, JSON.stringify(this._val, null, 2));
    }
  }

  /** 初始化 */
  private async init() {
    try {
      let buf = await readFile(this.path);

      if (process.env.NODE_ENV === 'production') {
        buf = await gunzip(buf);
      }

      this.set(JSON.parse(buf.toString()));
    }
    catch (err) {
      this.write();
    }
  }

  /** 设置数据 */
  set(data: Partial<T>) {
    this._val = {
      ...this._val,
      ...data,
    };

    this.write();
  }

  /** 填充数值 */
  fill(val: Partial<T>) {
    const data: Partial<T> = {};

    Object.entries(val).forEach(([key, val]) => {
      if (isUndef(data[key]) && isDef(val)) {
        data[key] = val;
      }
    });

    this.set(data)
  }

  /**
   * 写入硬盘
   *  - 延迟 200 ms
   */
  write = debounce(() => this._write(), 200);
}
