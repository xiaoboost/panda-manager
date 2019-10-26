import Watcher from '../lib/watcher';
import useForceUpdate from './use-force-update';

import { useRef, useEffect } from 'react';

export default function useWatcher<T>(watcher: Watcher<T>) {
    const update = useForceUpdate();
    const state = useRef(watcher.origin);

    useEffect(() => {
        function handleStatusChange(val: T) {
            state.current = val;
            update();
        }

        watcher.subscribe(handleStatusChange);

        return () => watcher.unSubscribe(handleStatusChange);
    }, []);

    return [state.current, watcher.dispatch.bind(watcher)] as const;
}
