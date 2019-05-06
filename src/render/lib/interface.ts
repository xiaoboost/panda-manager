// import { resolveRender } from 'render/lib/utils';
import { remote, MessageBoxOptions } from 'electron';

// const MainNativeImage = remote.nativeImage;
// const QuestionIcon = MainNativeImage.createFromPath(resolveRender('icons/question/icon.png'));

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
            // icon: QuestionIcon,
        };

        remote.dialog.showMessageBox(win, option, (response) => {
            if (response === 1) {
                resolve();
            }
        });
    });
}