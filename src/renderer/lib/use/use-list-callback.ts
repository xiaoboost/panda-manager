import { useEffect, useRef } from 'react';

/**
 * 创建列表数据回调
 * @param data 列表数据
 * @param createCb 创建回调的函数
 */
export default function useListCallback<T, F extends AnyFunction>(data: T[], createCb: (item: T, i: number) => F): F[] {
    /** 上一次的原始数据 */
    const ref = useRef(new Map<T, F>());
    /** 当前缓存记录 */
    const map = new Map(new Map<T, F>());

    useEffect(() => {
        ref.current = map;
    });

    return data.map((item, i) => {
        const cache = ref.current.get(item);
        const cb = cache ? cache : createCb(item, i);
        
        map.set(item, cb);

        return cb;
    });
}
