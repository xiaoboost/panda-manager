import { app, BrowserWindow } from 'electron';
import { resolveRoot } from '@panda/client-utils';
import { windowStateKeeper } from '@panda/window-manager';

import { service } from '@panda/service';
import { initialize as initializeFetch } from '@panda/fetch/client';
import { initialize as initializeRemote } from '@panda/remote/client';

/** 主窗口 */
export let win: BrowserWindow | null;

/** 创建主界面窗口 */
export async function install() {
  win = await windowStateKeeper({
    title: 'Panda Manager',
    width: 800,
    height: 600,
    center: true,
    frame: false,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      webgl: false,
      enableWebSQL: false,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      safeDialogs: true,
      sandbox: false,
      allowRunningInsecureContent: false,
      preload: resolveRoot('preload/index.js'),
      devTools: process.env.NODE_ENV === 'development',
    },
  });

  win.loadFile(resolveRoot('views/main/index.html'));

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  initializeRemote(win);
  initializeFetch(win, service);

  // 主界面被关闭时，退出软件
  win.on('closed', () => {
    win = null;
    app.quit();
  });
}
