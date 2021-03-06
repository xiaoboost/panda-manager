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
