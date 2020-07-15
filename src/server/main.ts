import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

import { route } from './controller';
import { EventData } from 'src/utils/typings';
import { toMainEventName, toRendererEventName } from './utils/constant';

async function service(event: IpcMainEvent, param: EventData) {
    try {
        event.reply(toRendererEventName, await route(param));
    }
    catch (e) {
        event.reply(toRendererEventName, {
            ...param,
            error: e.message,
        });
    }
}

export function install(win: BrowserWindow) {
    ipcMain.on(toMainEventName, service);
}
