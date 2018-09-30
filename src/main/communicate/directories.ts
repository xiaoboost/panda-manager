import { IpcMainEvent } from './index';
import { BrowserWindow, ipcMain, dialog } from 'electron';
import { SelectDirectoriesDialog } from '../../shared/constant';

export function install(win: BrowserWindow | null) {
    ipcMain.on(SelectDirectoriesDialog.openDialog, ({ sender }: IpcMainEvent) => {
        if (!win) {
            sender.send(SelectDirectoriesDialog.selected, []);
        }
        else {
            dialog.showOpenDialog(win, { properties: ['openDirectory'] }, (paths) => {
                sender.send(SelectDirectoriesDialog.selected, paths);
            });
        }
    });
}

/** 为主界面卸载通信事件 */
export function uninstall() {
    ipcMain.removeAllListeners(SelectDirectoriesDialog.openDialog);
}
