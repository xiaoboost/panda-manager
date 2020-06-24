import { format } from 'url';
import { app, BrowserWindow } from 'electron';

import { resolveRender } from 'src/utils/node/env';
import { windowStateKeeper } from './window-state';

/** 主窗口 */
export let win: BrowserWindow | null;

/** 创建主界面窗口 */
export async function install() {
    win = await windowStateKeeper({
        width: 800,
        height: 600,
        center: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: process.env.NODE_ENV !== 'development',
        },
    });

    win.loadURL(format({
        pathname: resolveRender('index.html'),
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
}
