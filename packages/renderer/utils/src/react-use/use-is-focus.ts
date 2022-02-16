import { getCurrentWindow } from '@electron/remote/renderer';
import { useState, useEffect } from 'react';

export function useIsFocus() {
  const win = getCurrentWindow();
  const [isFocus, setState] = useState(win.isFocused());

  useEffect(() => {
    const setFocus = () => setState(true);
    const setUnFocus = () => setState(false);

    win.on('focus', setFocus);
    win.on('blur', setUnFocus);

    return () => {
      win.removeListener('maximize', setFocus);
      win.removeListener('blur', setUnFocus);
    };
  }, []);

  return isFocus;
}
