import { format } from 'url';
import { app, BrowserWindow } from 'electron';

import { resolveRoot } from 'src/utils/node/env';
import { windowStateKeeper } from './window-state';
import { install as installServer } from 'src/server/main';

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
            nodeIntegration: true,
            webSecurity: process.env.NODE_ENV !== 'development',
        },
    });

    win.loadURL(format({
        pathname: resolveRoot('pages/renderer.html'),
        protocol: 'file:',
        slashes: true,
    }));

    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }

    // 主界面被关闭时，退出软件
    win.on('closed', () => {
        win = null;
        app.quit();
    });

    installServer(win);
}
