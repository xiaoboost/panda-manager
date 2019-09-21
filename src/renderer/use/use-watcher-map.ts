import Watcher from '../lib/watcher';

import { useEffect } from 'react';
import { useMap } from 'react-use';

export default function useWatcherMap<T extends object>(watcher: Watcher<T>) {
    const [map, methods] = useMap(watcher.origin);

    useEffect(() => watcher.dispatch(map), [map]);

    return [map, methods] as const;
}
