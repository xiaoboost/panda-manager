// import * as ipc from '@panda/fetch';

import { RPC, log } from '@panda/shared';
import { useState, useEffect } from 'react';
import { getRemoteWindow } from '@panda/remote/renderer';

export function useIsFocus() {
  const [isFocus, setState] = useState(true);

  useEffect(() => {
    const setFocus = () => setState(true);
    const setUnFocus = () => setState(false);
    const isFocused = getRemoteWindow().isFocused();

    setState(isFocused);

    if (process.env.NODE_ENV === 'development') {
      log(`初始化时，窗口此时${isFocused ? '有' : '没有'}焦点`);
    }

    // ipc.addBroadcastListener(RPC.BroadcastName.Focus, setFocus);
    // ipc.addBroadcastListener(RPC.BroadcastName.Blur, setUnFocus);

    // ipc.fetch<boolean>(RPC.FetchName.IsFocused).then(({ data }) => {
    //   if (process.env.NODE_ENV === 'development') {
    //     log(`初始化时，窗口此时${data ? '有' : '没有'}焦点`);
    //   }

    //   setState(data);
    // });

    return () => {
      // ipc.removeBroadcastListener(RPC.BroadcastName.Focus, setFocus);
      // ipc.removeBroadcastListener(RPC.BroadcastName.Blur, setUnFocus);
    };
  }, []);

  return isFocus;
}
