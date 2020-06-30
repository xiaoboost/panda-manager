export * from './model/types';

import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

import {
    EventData,
    EventName,
    toMainEventName,
    toRendererEventName,
} from './utils/types';

import {
    Config,
} from './controller';

async function route(param: EventData): Promise<EventData> {
    const { data, name } = param;

    let err = '';
    let result: any = void 0;

    switch (name) {
        case EventName.GetConfig: {
            result = await Config.get();
            break;
        }
        default: {
            err = 'Unkonw Method.';
        }
    }

    return {
        ...param,
        error: err,
        data: result,
    };
}

async function service(event: IpcMainEvent, param: EventData) {
    debugger;

    const result = await route(param);
    event.reply(toRendererEventName, result);
}

export function install() {
    ipcMain.on(toMainEventName, service);
}

export function toRenderer(win: BrowserWindow) {
    win.webContents;
}
