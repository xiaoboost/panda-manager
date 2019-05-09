import { useState } from 'react';
import { objectMethods } from './utils';

type ObjectMethod = typeof objectMethods;

/** 数组钩子 */
export function useObject<T extends object>(defaultVal?: T) {
    const [state, setState] = useState((defaultVal || {}) as T);
    const dispatch = <N extends keyof ObjectMethod>(name: N, payload: Parameters<ObjectMethod[N]>[1]) => {
        const newVal = (objectMethods[name] as any)(state, payload);
        setState(newVal);
    };

    return [state, dispatch] as const;
}
