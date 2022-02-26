import React from 'react';

import { style } from './style';
import { Bamboo, Recover } from '@panda/components';
import { useIsFocus, useIsMaximize } from '@panda/renderer-utils';
import { stringifyClass } from '@xiao-ai/utils';
import { fetch } from '@panda/fetch/renderer';
import { ServiceName } from '@panda/shared';
import { getRemoteWindow } from '@panda/remote/renderer';

import { MenuNav, PanelItem, PanelSplit } from './menu';

import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

import {
  MinusOutlined,
  CloseOutlined,
  BorderOutlined,
} from '@ant-design/icons';

const stopEvent = (ev: React.MouseEvent) => ev.stopPropagation();

export function Header() {
  const isFocus = useIsFocus();
  const isMaximize = useIsMaximize();
  const location = useLocation();
  const navigate = useNavigate();

  const maximize = useCallback(() => getRemoteWindow().maximize(), []);
  const unMaximize = useCallback(() => getRemoteWindow().unmaximize(), []);
  const minimize = useCallback(() => getRemoteWindow().minimize(), []);
  const close = useCallback(() => getRemoteWindow().close(), []);
  const headerDbClick = useCallback(
    () => {
      const win = getRemoteWindow();
      isMaximize ? win.unmaximize() : win.maximize();
    },
    [isMaximize],
  );

  return (
    <header
      onDoubleClick={headerDbClick}
      className={stringifyClass(style.classes.header, {
        [style.classes.headerUnFocus]: !isFocus,
      })}
    >
      <span>
        <Bamboo
          className={style.classes.logo}
          onDoubleClick={stopEvent}
        />
        <span
          className={stringifyClass(style.classes.tabItem, {
            [style.classes.highlightTabItem]: location.pathname === '/',
          })}
          onClick={() => navigate('/')}
        >
          列表
        </span>
        <span
          className={stringifyClass(style.classes.tabItem, {
            [style.classes.highlightTabItem]: location.pathname === '/setting',
          })}
          onClick={() => navigate('/setting')}
        >
          设置
        </span>
        <MenuNav
          title={<span onDoubleClick={stopEvent}>帮助</span>}
          className={style.classes.tabItem}
          highlightClassName={style.classes.highlightTabItem}
        >
          <PanelItem disabled>发行说明</PanelItem>
          <PanelItem disabled>检查更新</PanelItem>
          <PanelSplit />
          <PanelItem onClick={() => fetch(ServiceName.OpenAboutModal)}>关于</PanelItem>
        </MenuNav>
      </span>
      <span className={style.classes.title}>Panda Manager</span>
      <span>
        {/* 最小化 */}
        <MinusOutlined className={style.classes.icon} onClick={minimize} />
        {isMaximize
          /* 还原 */
          ? <Recover className={style.classes.icon} onClick={unMaximize} />
          /* 最大化 */
          : <BorderOutlined
            className={style.classes.icon}
            onClick={maximize}
          />
        }
        {/* 关闭 */}
        <CloseOutlined
          className={stringifyClass(style.classes.icon, style.classes.iconClose)}
          onClick={close}
        />
      </span>
    </header>
  );
}
