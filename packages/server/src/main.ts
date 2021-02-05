import type { BrowserWindow, IpcMain, IpcMainEvent } from 'electron';
import { MainEventName } from '@panda/shared';

let local: BrowserWindow;

async function service(event: IpcMainEvent, param: any) {
    // try {
    //     const result = await route(param, {
    //         win: local,
    //         onProgress(progress: number) {
    //             toRenderProgress(param.$$id, progress);
    //         },
    //     });

    //     event.reply(names.toRendererEventName, {
    //         ...param,
    //         data: result,
    //     });
    // }
    // catch (e) {
    //     event.reply(names.toRendererEventName, {
    //         ...param,
    //         error: e.message,
    //     });
    // }
}

/** 安装服务器 */
export function install(ipcMain: IpcMain) {
    ipcMain.on(MainEventName, (event, params) => {

    });
}
