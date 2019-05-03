import { useState, useEffect } from 'react';

type Subscribe<T> = (now: T, pre?: T) => void;

export default class Store<T> {
    /** 此时的值 */
    value: T;

    /** 订阅函数 */
    private subs: Subscribe<T>[] = [];

    constructor(initVal: T) {
        this.value = initVal;
    }

    /** 订阅此值的变化 */
    subscribe(sub: Subscribe<T>) {
        this.subs.push(sub);
    }

    /** 取消订阅此值的变化 */
    unSubscribe(sub: Subscribe<T>) {
        this.subs = this.subs.filter((f) => f !== sub);
    }

    /** 发布此值的变化 */
    dispatch(val: T) {
        const oldVal = this.value;

        this.value = val;
        this.subs.forEach((cb) => cb(oldVal, val));
    }
}

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
