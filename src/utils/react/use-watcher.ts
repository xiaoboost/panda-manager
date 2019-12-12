import useForceUpdate from './use-force-update';

import { useRef, useEffect } from 'react';
import { Watcher, BaseType, isBaseType, isArray } from '../shared';

export default function useWatcher<T>(watcher: Watcher<T[]>): [T[], (val: T[]) => void];
export default function useWatcher<T extends BaseType>(watcher: Watcher<T>): [T, (val: T) => void];
export default function useWatcher<T extends object>(watcher: Watcher<T>): [Readonly<T>, (val: Partial<T>) => void];
export default function useWatcher<T>(watcher: Watcher<T>) {
    const update = useForceUpdate();
    const state = useRef(watcher.data);

    const handleChange = (isBaseType(watcher.data) || isArray(watcher.data))
        ? (val: T) => {
            state.current = val as any;
            update();
        }
        : (val: Partial<T>) => {
            state.current = {
                ...state.current,
                ...val,
            };
            update();
        };

    useEffect(() => {
        watcher.observe(handleChange);
        return () => watcher.unObserve(handleChange);
    }, []);

    return [state.current, handleChange] as const;
}
