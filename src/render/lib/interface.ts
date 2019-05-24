import { remote, MessageBoxOptions } from 'electron';

/** 选择文件夹 */
export function selectDirectory() {
    return new Promise<string>((resolve) => {
        const win = remote.getCurrentWindow();

        remote.dialog.showOpenDialog(win, { properties: ['openDirectory'] }, (paths) => {
            if (paths) {
                resolve(paths[0]);
            }
        });
    });
}

/** 原生警告对话框 */
export function warnDialog(title: string, message: string) {
    return new Promise<void>((resolve) => {
        const win = remote.getCurrentWindow();
        const option: MessageBoxOptions = {
            title,
            message,
            type: 'warning',
            buttons: ['取消', '确定'],
        };

        remote.dialog.showMessageBox(win, option, (response) => {
            if (response === 1) {
                resolve();
            }
        });
    });
}
