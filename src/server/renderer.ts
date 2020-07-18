import { ipcRenderer } from 'electron';

import {
    toMainEventName,
    toRendererEventName,
    toRendererProgressEventName,
} from './utils/constant';

import { EventName } from 'src/utils/typings';

interface SwitchCache {
    onProgress?(progress: number): void;
    resolve(data?: any): void;
    reject(data?: any): void;
}

interface RequestConfig<T = any> {
    onProgress?(progress: number): any;
    params?: T;
}

/** 事件数据 */
export interface EventData<T = undefined> {
    name: EventName;
    $$id: number;
    data: T;
    error?: string;
}

interface ProgressEvent {
    $$id: number;
    progress: number;
}

/** 全局事件编号 */
let eventId = 1;
/** 全局事件缓存 */
const eventMap: Record<number, SwitchCache> = {};

export function install() {
    ipcRenderer.on(toRendererEventName, (_, event: EventData<any>) => {
        const { $$id: id, data, error } = event;
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

    ipcRenderer.on(toRendererProgressEventName, (_, event: ProgressEvent) => {
        const { $$id: id, progress } = event;
        const switchCache = eventMap[id];

        if (!switchCache?.onProgress) {
            return;
        }

        switchCache?.onProgress(progress);
    });
}

export function toServer<T, U = any>(name: EventName, config: RequestConfig<U> = {}) {
    return new Promise<T>((resolve, reject) => {
        const event: EventData<U> = {
            name,
            data: config.params as U,
            $$id: eventId++,
        };

        eventMap[event.$$id] = {
            resolve,
            reject,
        };

        if (config.onProgress) {
            eventMap[event.$$id].onProgress = config.onProgress;
        }

        ipcRenderer.send(toMainEventName, event);
    });
}
