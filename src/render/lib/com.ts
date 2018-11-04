import { remote, MessageBoxOptions } from 'electron';

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

export function confirmDialog(title: string, message: string) {
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
