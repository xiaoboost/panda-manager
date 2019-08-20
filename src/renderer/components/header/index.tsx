import './index.styl';

import { default as React } from 'react';

import { remote } from 'electron';
import { stringifyClass } from 'utils/web';
import { useIsFocus, useIsMaximize } from 'renderer/lib/use';

import AIcon from 'antd/es/icon';
import BIcon from 'renderer/components/icon';

export default function Header() {
    const isFocus = useIsFocus();
    const isMaximize = useIsMaximize();
    const win = remote.getCurrentWindow();

    return (
        <header className={stringifyClass(['app-header',  {
            'app-header__focus': isFocus,
        }])}>
            <span>
                <i className='app-title-bar__icon'></i>
                <span className='app-title-bar__title'>Panda Manager</span>
            </span>
            <span>
                {/* 最小化 */}
                <AIcon
                    type="minus"
                    className='app-title-bar__icon'
                    onClick={() => win.minimize()}
                />
                {isMaximize
                    /* 还原 */
                    ? <BIcon
                        type='recover'
                        className='app-title-bar__icon'
                        onClick={() => win.unmaximize()}
                    />
                    /* 最大化 */
                    : <AIcon
                        type="border"
                        className='app-title-bar__icon'
                        onClick={() => win.maximize()}
                    />}
                {/* 关闭 */}
                <AIcon
                    type='close'
                    className='app-title-bar__icon icon-close'
                    onClick={() => win.close()}
                />
            </span>
        </header>
    );
}
