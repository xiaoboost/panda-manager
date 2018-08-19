import * as path from 'path';
import * as url from 'url';

import { app, BrowserWindow } from 'electron';
import { devHttpPort } from '../../build/config';

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL(`http://localhost:${devHttpPort}`);
        win.webContents.openDevTools();
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../render/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
