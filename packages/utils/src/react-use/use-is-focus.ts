import { remote } from 'electron';
import { useState, useEffect } from 'react';

export function useIsFocus() {
    const win = remote.getCurrentWindow();
    const [isFocus, setState] = useState(win.isFocused());

    useEffect(() => {
        const setFocuse = () => setState(true);
        const setUnFocuse = () => setState(false);

        win.on('focus', setFocuse);
        win.on('blur', setUnFocuse);

        return () => {
            win.removeListener('maximize', setFocuse);
            win.removeListener('blur', setUnFocuse);
        };
    }, []);

    return isFocus;
}
