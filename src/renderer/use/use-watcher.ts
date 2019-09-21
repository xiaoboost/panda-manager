import Watcher from '../lib/watcher';

import { useState, useEffect } from 'react';

export default function useWatcher<T>(watcher: Watcher<T>) {
    const [state, setState] = useState(watcher.value);

    useEffect(() => {
        function handleStatusChange(val: T) {
            setState(val);
        }

        watcher.subscribe(handleStatusChange);

        return () => watcher.unSubscribe(handleStatusChange);
    }, []);

    return [state, watcher.dispatch.bind(watcher)] as const;
}
