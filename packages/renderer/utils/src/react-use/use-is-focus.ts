import { log } from '@panda/shared';
import { useState, useEffect } from 'react';
import { getRemoteWindow } from '@panda/remote/renderer';

export function useIsFocus() {
  const [isFocus, setState] = useState(true);

  useEffect(() => {
    const win = getRemoteWindow();
    const setFocus = () => setState(true);
    const setUnFocus = () => setState(false);
    const isFocused = win.isFocused();

    setState(isFocused);

    if (process.env.NODE_ENV === 'development') {
      log(`初始化时，窗口此时${isFocused ? '有' : '没有'}焦点`);
    }

    win.on('focus', setFocus);
    win.on('blur', setUnFocus);

    return () => {
      win.off('focus', setFocus);
      win.off('blur', setUnFocus);
    };
  }, []);

  return isFocus;
}
