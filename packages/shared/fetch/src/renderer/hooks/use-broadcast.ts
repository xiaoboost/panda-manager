import { useEffect, useState } from 'react';
import { subscriber } from '../broadcast';
import { BroadcastName } from '../../shared';

export function useBroadcast<T = any>(name: BroadcastName) {
  const [state, setState] = useState<T | undefined>();

  useEffect(() => {
    function onChange(data: T) {
      setState(data);
    }

    subscriber.observe(name, onChange);

    return () => {
      subscriber.unObserve(name, onChange);
    };
  }, []);

  return state;
}
