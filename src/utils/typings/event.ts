import { BrowserWindow } from 'electron';

/** 通信事件名称 */
export enum EventName {
    GetConfig = 'get-config',
    UpdateConfig = 'update-config',
    UpdateSortOption = 'update-sort-option',
    GetFilesList = 'get-files-list',
    GetFileDetail = 'get-file-detail',
    UpdateFilesList = 'update-files-list',
    OpenFile = 'open-file',
}

/** 事件交换数据格式 */
export interface EventData<T = undefined> {
    data: T;
    $$id: number;
    name: EventName;
    error?: string;
}

/** 事件数据上下文 */
export interface EventContext {
    win: BrowserWindow;
    onProgress(progress: number): any;
}

/** 进度事件 */
export interface ProgressEvent {
    $$id: number;
    progress: number;
}
