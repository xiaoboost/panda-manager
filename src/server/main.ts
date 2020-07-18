import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

import { route } from './controller';
import { EventData, ProgressEvent } from 'src/utils/typings';
import { installFilesQueue } from './service/files-queue';

import * as names from './utils/constant';

let local: BrowserWindow;

function toRenderProgress($$id: number, progress: number) {
    if (!local) {
        return;
    }

    const data: ProgressEvent = {
        $$id,
        progress,
    };

    local.webContents.send(names.toProgressEventName, data);
}

async function service(event: IpcMainEvent, param: EventData) {
    try {
        const result = await route(param, {
            win: local,
            onProgress(progress: number) {
                toRenderProgress(param.$$id, progress);
            },
        });

        event.reply(names.toRendererEventName, {
            ...param,
            data: result,
        });
    }
    catch (e) {
        event.reply(names.toRendererEventName, {
            ...param,
            error: e.message,
        });
    }
}

export function install(win: BrowserWindow) {
    ipcMain.on(names.toMainEventName, service);

    local = win;
    installFilesQueue(win);
}
