import { log } from '@panda/shared';
import { useState, useEffect } from 'react';
import { getRemoteWindow } from '@panda/remote/renderer';

export function useIsMaximize() {
  const [isMaximize, setState] = useState(true);

  useEffect(() => {
    const win = getRemoteWindow();
    const setMaximize = () => setState(true);
    const setUnMaximize = () => setState(false);
    const isMaximized = win.isMaximized();

    setState(isMaximized);

    if (process.env.NODE_ENV === 'development') {
      log(`初始化时，窗口此时为${isMaximized ? '' : '非'}最大化状态`);
    }

    win.on('maximize', setMaximize);
    win.on('unmaximize', setUnMaximize);

    return () => {
      win.removeListener('maximize', setMaximize);
      win.removeListener('unmaximize', setUnMaximize);
    };
  }, []);

  return isMaximize;
}
