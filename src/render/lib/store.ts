import { useState, useEffect } from 'react';

// import * as array from './utils/array';
import { isBaseType, isArray } from './utils/assert';

type Subscribe<T> = (now: T, pre?: T) => void;

/** 需要代理的数组方法 */
const methodsToIntercept = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/** 储存值类 */
export default class Store<T> {
    /** 代理值 */
    private _proxy: T;
    /** 原始值 */
    private _origin: T;
    /** 是否被冻结 */
    private _isFreeze = false;
    /** 订阅函数 */
    private subs: Subscribe<T>[] = [];

    get value() {
        return this._proxy;
    }
    set value(val: T) {
        this.dispatch(val);
    }

    /** 对外获取原始值 */
    get origin() {
        return this._origin;
    }
    /** 是否被冻结 */
    get isFreeze() {
        return this._isFreeze;
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
                this.dispatch({
                    ...target,
                    [key]: value,
                });

                return true;
            },
        };

        // 数组还需要代理部分方法
        if (isArray(data)) {
            proxyHandler.get = (target: T & any[], key: string) => {
                if (methodsToIntercept.includes(key)) {
                    return (...args: any[]) => {
                        const newArr = Array.from(target);
                        newArr[key](...args);
                        this.dispatch(newArr as any);
                    };
                }
                else {
                    return target[key];
                }
            };

            return new Proxy(Array.from(data), proxyHandler);
        }
        else {
            return new Proxy({ ...data } as any, proxyHandler);
        }
    }

    /** 订阅此值的变化 */
    subscribe(sub: Subscribe<T>) {
        this.subs.push(sub);
    }
    /** 取消订阅此值的变化 */
    unSubscribe(sub: Subscribe<T>) {
        this.subs = this.subs.filter((f) => f !== sub);
    }

    /** 冻结此值 */
    freeze() {
        this._isFreeze = true;
    }
    /** 解冻此值 */
    thaw() {
        this._isFreeze = false;
    }

    /** 发布此值 */
    dispatch(val?: T) {
        // 被冻结，不允许发布
        if (this.isFreeze) {
            return;
        }

        // 输入了新得值
        if (arguments.length > 0) {
            // 新值与旧值相同，直接退出
            if (this._proxy === val || this._origin === val) {
                return;
            }

            const oldVal = this._proxy;

            this._origin = val!;
            this._proxy = this.proxy(val!);
            this.subs.forEach((cb) => cb(val!, oldVal));
        }
        // 没有输入新值，强制发布
        else {
            this._proxy = this.proxy(this._origin);
            this.subs.forEach((cb) => cb(this.value));
        }
    }
}

/** 使用储存值 */
export function useStore<T>(store: Store<T>) {
    const [state, setState] = useState(store.value);

    useEffect(() => {
        store.subscribe(setState);
        return () => store.unSubscribe(setState);
    });

    return [state, store.dispatch.bind(store)] as const;
}
