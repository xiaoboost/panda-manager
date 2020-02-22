import React from 'react';
import styles from './index.less';

import { remote } from 'electron';
import { stringifyClass } from '@utils/web';

import { Bamboo, Recover } from '@utils/components';

import { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router';
import { useIsFocus, useIsMaximize } from '@utils/react-use';

import {
    ArrowLeftOutlined,
    MinusOutlined,
    CloseOutlined,
    BorderOutlined,
} from '@ant-design/icons';

// TODO: 按键按下也应该有效果

export function Header() {
    const isFocus = useIsFocus();
    const isMaximize = useIsMaximize();
    const location = useLocation();
    const history = useHistory();

    const win = remote.getCurrentWindow();

    const maximize = useCallback(() => win.maximize(), [win]);
    const unmaximize = useCallback(() => win.unmaximize(), [win]);
    const minimize = useCallback(() => win.minimize(), [win]);
    const close = useCallback(() => win.close(), [win]);

    const logoDbClickStop = useCallback((ev: React.MouseEvent) => ev.stopPropagation(), []);
    const headerDbClick = useCallback(() => isMaximize ? win.unmaximize() : win.maximize(), [win, isMaximize]);

    return (
        <header
            onDoubleClick={headerDbClick}
            className={stringifyClass(styles.appHeader,  {
                [styles.appHeaderUnfocus]: !isFocus,
            })}>
            <span>
                <span onDoubleClick={logoDbClickStop}>
                    {location.pathname === '/'
                        ? <Bamboo className={styles.appTitleBarLogo} />
                        : <ArrowLeftOutlined
                            className={styles.appTitleBarIcon}
                            onClick={() => history.goBack()}
                        />
                    }
                </span>
                <span className={styles.appTitleBarTitle}>Panda Manager</span>
            </span>
            <span>
                {/* 最小化 */}
                <MinusOutlined
                    className={styles.appTitleBarIcon}
                    onClick={minimize}
                />
                {isMaximize
                    /* 还原 */
                    ? <Recover
                        className={styles.appTitleBarIcon}
                        onClick={unmaximize}
                    />
                    /* 最大化 */
                    : <BorderOutlined
                        className={styles.appTitleBarIcon}
                        onClick={maximize}
                    />}
                {/* 关闭 */}
                <CloseOutlined
                    className={`${styles.appTitleBarIcon} ${styles.iconClose}`}
                    onClick={close}
                />
            </span>
        </header>
    );
}
