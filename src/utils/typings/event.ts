/** 通信事件名称 */
export enum EventName {
    GetConfig = 'get-config',
    UpdateConfig = 'update-config',
    UpdateSortOption = 'update-sort-option',
    GetFilesList = 'get-files-list',
    GetFileDetail = 'get-file-detail',
    UpdateFilesList = 'update-files-list',
}

/** 事件数据 */
export interface EventData<T = undefined> {
    name: EventName;
    id: number;
    data: T;
    error?: string;
}
