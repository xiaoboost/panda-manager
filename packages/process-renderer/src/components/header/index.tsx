import styles from './index.less';

import React from 'react';

import { remote } from 'electron';
import { stringifyClass } from '@utils/web';
import { useIsFocus, useIsMaximize, useRouter, useCallback } from '@utils/react-use';

import { Icon as AIcon } from 'antd';
import { Icon as BIcon } from '@utils/components';

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
            className={stringifyClass(styles.appHeader,  {
                [styles.appHeaderFocus]: isFocus,
            })}>
            <span>
                <span onDoubleClick={logoDbClickStop}>
                    {router.location.pathname === '/'
                        ? <BIcon className={styles.appTitleBarLogo} type='bamboo' />
                        : <AIcon
                            type='arrow-left'
                            className={styles.appTitleBarIcon}
                            onClick={routerBack}
                        />
                    }
                </span>
                <span className={styles.appTitleBarTitle}>Panda Manager</span>
            </span>
            <span>
                {/* 最小化 */}
                <AIcon
                    type='minus'
                    className={styles.appTitleBarIcon}
                    onClick={minimize}
                />
                {isMaximize
                    /* 还原 */
                    ? <BIcon
                        type='recover'
                        className={styles.appTitleBarIcon}
                        onClick={unmaximize}
                    />
                    /* 最大化 */
                    : <AIcon
                        type='border'
                        className={styles.appTitleBarIcon}
                        onClick={maximize}
                    />}
                {/* 关闭 */}
                <AIcon
                    type='close'
                    className={`${styles.appTitleBarIcon} ${styles.iconClose}`}
                    onClick={close}
                />
            </span>
        </header>
    );
}
