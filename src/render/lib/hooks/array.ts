import { useState } from 'react';
import { arrayMethods } from './utils';

type ArrayMethod = typeof arrayMethods;

/** 数组钩子 */
export function useArray<T = any>(defaultVal: T[]) {
    const [state, setState] = useState(defaultVal);
    const dispatch = <N extends keyof ArrayMethod>(name: N, payload: Parameters<ArrayMethod[N]>[1]) => {
        const newVal = (arrayMethods[name] as any)(state, payload);
        setState(newVal);
    };

    return [state, dispatch] as const;
}
