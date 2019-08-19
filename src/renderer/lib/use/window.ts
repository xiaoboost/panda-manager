import { remote } from 'electron';
import { useState, useEffect } from 'react';

export function useIsMaximize() {
    const win = remote.getCurrentWindow();
    const [isMaximize, setState] = useState(win.isMaximized());

    useEffect(() => {
        const setMaximize = () => setState(true);
        const setUnMaximize = () => setState(false);

        win.on('maximize', setMaximize);
        win.on('unmaximize', setUnMaximize);

        return () => {
            win.removeListener('maximize', setMaximize);
            win.removeListener('unmaximize', setUnMaximize);
        };
    }, []);

    return isMaximize;
}

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
