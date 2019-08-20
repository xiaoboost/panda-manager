import './index.styl';

import { remote } from 'electron';
import { default as React, useState, useEffect } from 'react';

import AIcon from 'antd/es/icon';
import BIcon from 'renderer/components/icon';

function useIsMaximize() {
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

export default function Header() {
    const isMaximize = useIsMaximize();

    return (
        <header className='app-header'>
            <span>
                <i className='app-title-bar__icon'></i>
                <span className='app-title-bar__title'>Panda Manager</span>
            </span>
            <span>
                {/* 最小化 */}
                <AIcon className='app-title-bar__icon' type="minus" />
                {isMaximize
                    /* 还原 */
                    ? <BIcon className='app-title-bar__icon' type='recover' />
                    /* 最大化 */
                    : <AIcon className='app-title-bar__icon' type="border" />}
                {/* 关闭 */}
                <AIcon className='app-title-bar__icon icon-close' type="close" />
            </span>
        </header>
    );
}
