import { ipcRenderer } from 'electron/renderer';
import { useState, useEffect } from 'react';

export function useIsFocus() {
  debugger;
  // console.log(electron);
  // ipcRenderer.

  // ipcRenderer.
  const win = remote.getCurrentWindow();
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
