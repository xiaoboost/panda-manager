import { ipcRenderer } from 'electron';
import { SelectDirectoriesDialog } from 'src/shared/constant';

export function selectDirectories() {
    return new Promise<string[]>((resolve) => {
        ipcRenderer.send(SelectDirectoriesDialog.openDialog);

        ipcRenderer.once(SelectDirectoriesDialog.selected, (event: any, paths: string[]) => {
            resolve(paths || []);
        });
    });
}
