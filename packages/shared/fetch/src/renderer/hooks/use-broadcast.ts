import { useEffect, useState } from 'react';
import { subscriber } from '../broadcast';
import { BroadcastName } from '../../shared';

export function useBroadcast<T = any>(name: BroadcastName, initVal?: T) {
  const [state, setState] = useState<T | undefined>(initVal);

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
