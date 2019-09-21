import Watcher from '../lib/watcher';

import { useEffect } from 'react';
import { useList } from 'react-use';

export default function useWatcherList<T>(watcher: Watcher<T[]>) {
    const [list, methods] = useList(watcher.origin);

    useEffect(() => watcher.dispatch(list), [list]);

    return [list, methods] as const;
}
