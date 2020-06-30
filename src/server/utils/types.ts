export const toMainEventName = '_to_main_event';
export const toRendererEventName = '_to_renderer_event';

export enum EventName {
    GetConfig,
    UpdateConfig,
    UpdateSortOption,
    GetObjectList,
    GetObjectDetail,
}

export interface EventData<T = undefined> {
    name: EventName;
    id: number;
    data: T;
    error?: string;
}
