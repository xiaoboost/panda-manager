import { remote } from 'electron';

export function selectDirectory() {
    return new Promise<string | null>((resolve) => {
        const win = remote.getCurrentWindow();

        remote.dialog.showOpenDialog(win, { properties: ['openDirectory'] }, (paths) => {
            resolve(paths ? paths[0] : null);
        });
    });
}
