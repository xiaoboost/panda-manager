import { useEffect, useState } from 'react';
import { BroadcastName, subscriber } from '@panda/fetch/renderer';
import { ReadItemBroadcast } from '@panda/shared';

export function useReadItem() {
  const [state, setState] = useState<ReadItemBroadcast | undefined>();

  useEffect(() => {
    function onChange(data: ReadItemBroadcast) {
      debugger;
      setState(data);
    }

    function clearState() {
      setState(undefined);
    }

    subscriber.observe(BroadcastName.ReadItemStart, onChange);
    subscriber.observe(BroadcastName.ReadItemEnd, clearState);

    return () => {
      subscriber.unObserve(BroadcastName.ReadItemStart, onChange);
      subscriber.unObserve(BroadcastName.ReadItemEnd, clearState);
    };
  }, []);

  return state;
}
