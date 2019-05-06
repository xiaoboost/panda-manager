import { useState, useEffect } from 'react';
import { isString, isUndef } from 'render/lib/utils';

type Reduer<T> = (val: T, payload?: any) => T;
type Subscribe<T> = (now: T, pre?: T) => void;

/** 储存值类 */
export default class Store<T, R extends Record<keyof R, Reduer<T>> = any> {
    /** 此时的值 */
    value: T;

    /** 分配器 */
    private reduer: R;
    /** 订阅函数 */
    private subs: Subscribe<T>[] = [];

    constructor(initVal: T, reduer?: R) {
        this.value = initVal;
        this.reduer = (reduer || {}) as R;
    }

    /** 订阅此值的变化 */
    subscribe(sub: Subscribe<T>) {
        this.subs.push(sub);
    }

    /** 取消订阅此值的变化 */
    unSubscribe(sub: Subscribe<T>) {
        this.subs = this.subs.filter((f) => f !== sub);
    }

    /** 发布此值 */
    dispatch(val: T): void;
    /** 按照预定的分配器发布此值 */
    dispatch<K extends keyof R>(name: K, payload: Parameters<R[K]>[1]): void;

    dispatch<K extends keyof R>(name: T | K, payload?: Parameters<R[K]>[1]) {
        let val: T;

        const oldVal = this.value;
        const isReduerKey = (x: any): x is K => (isString(x) && x in this.reduer);

        if (isReduerKey(name) && isUndef(payload)) {
            val = this.reduer[name](oldVal, payload);
        }
        else {
            val = name as T;
        }

        this.value = val;
        this.subs.forEach((cb) => cb(val, oldVal));
    }
}

/** 使用储存值 */
export function useStore<T>(store: Store<T>) {
    const [state, setState] = useState(store.value);

    useEffect(() => {
        function handleStatusChange(val: T) {
            setState(val);
        }

        store.subscribe(handleStatusChange);

        return () => store.unSubscribe(handleStatusChange);
    });

    return state;
}
