import React from 'react';

import { style } from './style';
import { clipboard } from 'electron';
import { Bamboo, Recover } from '@panda/components';
import { useIsFocus, useIsMaximize } from '@panda/renderer-utils';
import { stringifyClass } from '@xiao-ai/utils';
import { log } from '@panda/shared';
import { fetchSync, ServiceName } from '@panda/fetch/renderer';
import { getRemoteWindow, getRemoteDialog } from '@panda/remote/renderer';

import { MenuNav } from './menu';

import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { MenuItem, MenuSplit } from '../context-menu';
import { MinusOutlined, CloseOutlined, BorderOutlined } from '@ant-design/icons';

const stopEvent = (ev: React.MouseEvent) => ev.stopPropagation();
const openAboutModal = async () => {
  if (process.env.NODE_ENV === 'development') {
    log('打开“关于”对话框');
  }

  const buttons = ['确定', '复制'];
  const { data: info } = fetchSync<string>(ServiceName.GetBuildInfo);
  const result = await getRemoteDialog().showMessageBox({
    title: 'Panda Manager',
    message: info,
    type: 'info',
    buttons,
    cancelId: 0,
    noLink: true,
  });

  if (process.env.NODE_ENV === 'development') {
    log(`用户点击按钮：${buttons[result.response]}`);
  }

  if (result.response === 1) {
    clipboard.writeText(info);
  }
};

export function Header() {
  const isFocus = useIsFocus();
  const isMaximize = useIsMaximize();
  const location = useLocation();
  const navigate = useNavigate();

  const maximize = useCallback(() => getRemoteWindow().maximize(), []);
  const unMaximize = useCallback(() => getRemoteWindow().unmaximize(), []);
  const minimize = useCallback(() => getRemoteWindow().minimize(), []);
  const close = useCallback(() => getRemoteWindow().close(), []);
  const headerDbClick = useCallback(() => {
    const win = getRemoteWindow();
    isMaximize ? win.unmaximize() : win.maximize();
  }, [isMaximize]);

  return (
    <header
      onDoubleClick={headerDbClick}
      className={stringifyClass(style.classes.header, {
        [style.classes.headerUnFocus]: !isFocus,
      })}
    >
      <span>
        <Bamboo className={style.classes.logo} onDoubleClick={stopEvent} />
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
        <span style={{ margin: '0 4px' }} />
        <MenuNav
          title={<span onDoubleClick={stopEvent}>帮助</span>}
          className={style.classes.tabItem}
          highlightClassName={style.classes.highlightTabItem}
        >
          <MenuItem disabled>发行说明</MenuItem>
          <MenuItem disabled>检查更新</MenuItem>
          <MenuSplit />
          <MenuItem onClick={openAboutModal}>关于</MenuItem>
        </MenuNav>
      </span>
      <span className={style.classes.title}>Panda Manager</span>
      <span>
        {/* 最小化 */}
        <MinusOutlined className={style.classes.icon} onClick={minimize} />
        {isMaximize ? (
          /* 还原 */
          <Recover className={style.classes.icon} onClick={unMaximize} />
        ) : (
          /* 最大化 */
          <BorderOutlined className={style.classes.icon} onClick={maximize} />
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
