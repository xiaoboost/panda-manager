// import * as ipc from '@panda/fetch';

import { RPC, log } from '@panda/shared';
import { useState, useEffect } from 'react';
import { getRemoteWindow } from '@panda/remote/renderer';

export function useIsMaximize() {
  const [isMaximize, setState] = useState(true);
  // const [isMaximize, setState] = useState(win.isMaximized());

  useEffect(() => {
    const setMaximize = () => setState(true);
    const setUnMaximize = () => setState(false);
    const isMaximized = getRemoteWindow().isMaximized();

    setState(isMaximized);

    if (process.env.NODE_ENV === 'development') {
      log(`初始化时，窗口此时为${isMaximized ? '' : '非'}最大化状态`);
    }

    // win.on('maximize', setMaximize);
    // win.on('unmaximize', setUnMaximize);

    // ipc.fetch<boolean>(RPC.FetchName.IsMaximized).then(({ data }) => {
    //   if (process.env.NODE_ENV === 'development') {
    //     log(`初始化时，窗口此时为${data ? '' : '非'}最大化状态`);
    //   }

    //   setState(data);
    // });

    return () => {
    //   win.removeListener('maximize', setMaximize);
    //   win.removeListener('unmaximize', setUnMaximize);
    };
  }, []);

  return isMaximize;
}
