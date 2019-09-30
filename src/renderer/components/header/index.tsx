import './index.styl';

import React from 'react';

import { remote } from 'electron';
import { stringifyClass } from 'utils/web';
import { useIsFocus, useIsMaximize, useRouter, useCallback } from 'renderer/use';

import AIcon from 'antd/es/icon';
import BIcon from 'renderer/components/icon';

// TODO: 按键按下也应该有效果

export default function Header() {
    const isFocus = useIsFocus();
    const isMaximize = useIsMaximize();
    const router = useRouter();

    const win = remote.getCurrentWindow();

    const maximize = useCallback(() => win.maximize(), [win]);
    const unmaximize = useCallback(() => win.unmaximize(), [win]);
    const minimize = useCallback(() => win.minimize(), [win]);
    const close = useCallback(() => win.close(), [win]);
    const routerBack = useCallback(() => router.history.goBack(), [router]);

    const logoDbClickStop = useCallback((ev: React.MouseEvent) => ev.stopPropagation(), []);
    const headerDbClick = useCallback(() => isMaximize ? win.unmaximize() : win.maximize(), [win, isMaximize]);

    return (
        <header
            onDoubleClick={headerDbClick}
            className={stringifyClass('app-header',  {
                'app-header__focus': isFocus,
            })}>
            <span>
                <span onDoubleClick={logoDbClickStop}>
                    {router.location.pathname === '/'
                        ? <BIcon className='app-title-bar__logo' type='bamboo' />
                        : <AIcon
                            type='arrow-left'
                            className='app-title-bar__icon'
                            onClick={routerBack}
                        />
                    }
                </span>
                <span className='app-title-bar__title'>Panda Manager</span>
            </span>
            <span>
                {/* 最小化 */}
                <AIcon
                    type='minus'
                    className='app-title-bar__icon'
                    onClick={minimize}
                />
                {isMaximize
                    /* 还原 */
                    ? <BIcon
                        type='recover'
                        className='app-title-bar__icon'
                        onClick={unmaximize}
                    />
                    /* 最大化 */
                    : <AIcon
                        type='border'
                        className='app-title-bar__icon'
                        onClick={maximize}
                    />}
                {/* 关闭 */}
                <AIcon
                    type='close'
                    className='app-title-bar__icon icon-close'
                    onClick={close}
                />
            </span>
        </header>
    );
}
