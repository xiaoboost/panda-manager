import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

import {
    toMainEventName,
    toRendererEventName,
} from './utils/constant';

import {
    EventData,
    EventName,
} from 'src/utils/typings';

import {
    Config,
} from './controller';

async function route(param: EventData<any>): Promise<EventData<any>> {
    const { data, name } = param;

    let err = '';
    let result: any = void 0;

    switch (name) {
        case EventName.GetConfig: {
            result = await Config.get();
            break;
        }
        case EventName.UpdateConfig: {
            result = await Config.patchConfig(data);
            break;
        }
        case EventName.UpdateSortOption: {
            result = await Config.patchSort(data);
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

export function install() {
    ipcMain.on(toMainEventName, service);
}

export function toRenderer(win: BrowserWindow) {
    win.webContents;
}
