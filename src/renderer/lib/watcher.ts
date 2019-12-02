import { isBaseType, isArray, isFunc } from 'utils/shared';

type Subscribe<T> = (now: T, pre?: T) => void;

/** 储存值类 */
export default class Watcher<T> {
    /** 代理值 */
    private _proxy: T;
    /** 原始值 */
    private _origin: T;
    /** 订阅函数 */
    private subs: Subscribe<T>[] = [];

    get value() {
        return this._proxy;
    }
    set value(val: T) {
        this.dispatch(val);
    }

    /** 对外获取原始值副本 */
    get origin(): T {
        if (isBaseType(this._origin)) {
            return this._origin;
        }
        else if (isArray(this._origin)) {
            return this._origin.slice() as any;
        }
        else {
            return { ...this._origin };
        }
    }

    constructor(initVal: T) {
        this._origin = initVal;
        this._proxy = this.proxy(initVal);
    }

    /** 代理当前数据 */
    private proxy(data: T) {
        // 是基础类型直接返回
        if (isBaseType(data)) {
            return data;
        }

        // 拦截对象设置属性操作
        const proxyHandler: ProxyHandler<object> = {
            set: (target: T & object, key: PropertyKey, value: any) => {
                const result = Reflect.set(target, key, value);

                if (result) {
                    this.dispatch();
                }

                return result;
            },
        };

        return new Proxy(data as any, proxyHandler);
    }

    /** 订阅此值的变化 */
    subscribe(sub: Subscribe<T>) {
        this.subs.push(sub);
    }
    /** 取消订阅此值的变化 */
    unSubscribe(sub: Subscribe<T>) {
        this.subs = this.subs.filter((f) => f !== sub);
    }

    /** 订阅一次事件 */
    once() {
        return new Promise<T>((resolve) => {
            const callback = () => {
                resolve(this._origin);
                this.unSubscribe(callback);
            };

            this.subscribe(callback);
        });
    }
    /** 当值与输入相等时触发 */
    when(val: T | ((item: T) => boolean)) {
        const func = isFunc(val) ? val : (item: T) => item === val;

        if (func(this._origin)) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            const callback = (item: T) => {
                if (func(item)) {
                    resolve();
                    this.unSubscribe(callback);
                }
            };

            this.subscribe(callback);
        });
    }

    /** 发布此值 */
    dispatch(val?: T) {
        if (arguments.length > 0) {
            if (this._proxy === val || this._origin === val) {
                return;
            }

            const oldVal = this._proxy;

            this._origin = val!;
            this._proxy = this.proxy(val!);

            this.subs.forEach((cb) => cb(val!, oldVal));
        }
        else {
            this.subs.forEach((cb) => cb(this._proxy, this._proxy));
        }
    }
}
