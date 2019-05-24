import { useState, useEffect } from 'react';

import * as array from './utils/array';

type Subscribe<T> = (now: T, pre?: T) => void;

/** 储存值类 */
export default class Store<T> {
    /** 此时的值 */
    value: T;

    /** 是否被冻结 */
    private isFreeze = false;
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

    /** 冻结此值 */
    freeze() {
        this.isFreeze = true;
    }
    /** 解冻此值 */
    thaw() {
        this.isFreeze = false;
    }

    /** 发布此值 */
    dispatch(val: T) {
        // 被冻结，不允许改变值
        if (this.isFreeze) {
            return;
        }

        const oldVal = this.value;

        this.value = val;
        this.subs.forEach((cb) => cb(val, oldVal));
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

/** 使用对象储存值 */
export function useStoreMap<T extends object>(store: Store<T>) {
    const [map, set] = useState(store.value);
    const setMap = {
        /** 恢复初始值 */
        reset: () => set(store.value),
        /** 替换对象 */
        replace: (val: T) => set(val),
        /** 取出某个字段值 */
        get: <K extends keyof T>(key: K) => map[key],
        /** 设置某个字段值 */
        set: <K extends keyof T>(key: K, entry: T[K]) => set({
            ...map,
            [key]: entry,
        }),
    };

    return [map, setMap] as const;
}

/** 使用数组储存值 */
export function useStoreList<T extends Array<T>>(store: Store<Array<T>>) {
    const [list, set] = useState(store.value);
    const setList = {
        /** 替换数组 */
        replace: set,
        /** 清空数组 */
        clear: () => set([]),
        /** 取出数组某个下标的元素 */
        get: (index: number) => array.get(store.value, index),
        /** 设置数组某个下标的元素 */
        set: (index: number, val: T) => set((current) => [...current.slice(0, index), val, ...current.slice(index + 1)]),
        /** 删除数组某个下标的元素 */
        delete: (index: number) => set((current) => [...current.slice(0, index), ...current.slice(index + 1)]),
        /** 数组元素入栈 */
        push: (val: T) => set((current) => [...current, val]),
    };

    return [list, setList] as const;
}
