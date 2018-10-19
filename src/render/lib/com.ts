import { remote } from 'electron';

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
