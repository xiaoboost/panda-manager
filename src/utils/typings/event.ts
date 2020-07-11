/** 通信事件名称 */
export enum EventName {
    GetConfig,
    UpdateConfig,
    UpdateSortOption,
    GetFilesList,
    GetFileDetail,
    UpdateFilesList,
}

/** 事件数据 */
export interface EventData<T = undefined> {
    name: EventName;
    id: number;
    data: T;
    error?: string;
}
