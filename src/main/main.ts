import * as path from 'path';
import * as url from 'url';

import { app, BrowserWindow } from 'electron';

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: process.env.NODE_ENV !== 'development',
        },
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, '../render/index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        win = null;
    });
}

// 初始化主界面
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
