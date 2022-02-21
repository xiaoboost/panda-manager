import React from 'react';

import { style } from './style';

import { Bamboo, Recover } from '@panda/components';
import { useIsFocus, useIsMaximize } from '@panda/renderer-utils';
import { stringifyClass } from '@xiao-ai/utils';

import { useCallback } from 'react';
// import { useLocation, useHistory } from 'react-router';

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
  // const location = useLocation();
  // const history = useHistory();

  // const win = remote.getCurrentWindow();

  // const maximize = useCallback(() => win.maximize(), [win]);
  // const unMaximize = useCallback(() => win.unmaximize(), [win]);
  // const minimize = useCallback(() => win.minimize(), [win]);
  // const close = useCallback(() => win.close(), [win]);

  const logoDbClickStop = useCallback(
    (ev: React.MouseEvent) => ev.stopPropagation(),
    [],
  );
  // const headerDbClick = useCallback(
  //   () => (isMaximize ? win.unmaximize() : win.maximize()),
  //   [win, isMaximize],
  // );

  return (
    <header
      // onDoubleClick={headerDbClick}
      className={stringifyClass(style.classes.header, {
        [style.classes.headerUnFocus]: !isFocus,
      })}
    >
      <span>
        <span onDoubleClick={logoDbClickStop}>
          {location.pathname === '/' ? (
            <Bamboo className={style.classes.logo} />
          ) : (
            <ArrowLeftOutlined
              className={style.classes.icon}
              // onClick={() => history.goBack()}
            />
          )}
        </span>
        <span className={style.classes.title}>Panda Manager</span>
      </span>
      <span>
        {/* 最小化 */}
        {/* onClick={minimize} */}
        <MinusOutlined className={style.classes.icon} />
        {isMaximize ? (
          /* 还原 */
          // onClick={unmaximize}
          <Recover className={style.classes.icon} />
        ) : (
          /* 最大化 */
          <BorderOutlined
            className={style.classes.icon}
            // onClick={maximize}
          />
        )}
        {/* 关闭 */}
        <CloseOutlined
          className={stringifyClass(style.classes.icon, style.classes.iconClose)}
          onClick={close}
        />
      </span>
    </header>
  );
}
