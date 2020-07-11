import { ipcRenderer } from 'electron';

import {
    toMainEventName,
    toRendererEventName,
} from './utils/constant';

import {
    EventData,
    EventName,
} from 'src/utils/typings';

interface SwitchCache {
    resolve(data?: any): void;
    reject(data?: any): void;
}

/** 全局事件编号 */
let eventId = 1;
/** 全局事件缓存 */
const eventMap: Record<number, SwitchCache> = {};

export function install() {
    ipcRenderer.on(toRendererEventName, (_, event: EventData) => {
        const { id, data, error } = event;
        const switchCache = eventMap[id];

        if (!switchCache) {
            return;
        }

        if (error) {
            switchCache.reject(error);
        }
        else {
            switchCache.resolve(data);
        }

        delete eventMap[id];
    });
}

export function toServer<T>(name: EventName, data?: any) {
    return new Promise<T>((resolve, reject) => {
        const event: EventData = {
            name,
            data,
            id: eventId++,
        };

        eventMap[event.id] = {
            resolve,
            reject,
        };

        ipcRenderer.send(toMainEventName, event);
    });
}
