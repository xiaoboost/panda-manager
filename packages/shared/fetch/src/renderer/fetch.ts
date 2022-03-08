import { ipcRenderer } from 'electron';
import { log } from '@panda/shared';
import { isNumber } from '@xiao-ai/utils';
import { FetchParam, FetchStore } from './types';
import { ServiceName } from '../shared';

import {
  FetchEventName,
  ProgressData,
  ReplyEventName,
  ProgressEventName,
  FetchData,
  Status,
} from '../shared';

import type { OpenDialogOptions, MessageBoxOptions, MessageBoxReturnValue } from 'electron';
import type { TagGroupData } from '@panda/shared';

let eventId = 0;

const fetchStore: FetchStore[] = [];

// 返回事件
ipcRenderer.on(ReplyEventName, (_, params: FetchData) => {
  if (process.env.NODE_ENV === 'development') {
    log(`后端返回数据: ${JSON.stringify(params, null, 2)}`);
  }

  const dataIndex = fetchStore.findIndex((ev) => {
    return ev.eventId === params.eventId && ev.name === params.name;
  });

  if (dataIndex >= 0) {
    const data = fetchStore[dataIndex];
    fetchStore.splice(dataIndex, 1);

    if (params.error) {
      data.reject(new Error(params.error));
    } else {
      data.resolve(params);
    }
  }
});

// 进度事件
ipcRenderer.on(ProgressEventName, (_, params: ProgressData) => {
  if (process.env.NODE_ENV === 'development') {
    log(`后端返回进度数据: ${JSON.stringify(params, null, 2)}`);
  }

  debugger;
  const data = fetchStore.find((ev) => {
    return ev.eventId === params.eventId && ev.name === params.name;
  });

  if (data) {
    data.onProgress?.(params.progress);
  }
});

if (process.env.NODE_ENV === 'development') {
  log('Fetch 模块初始化');
}

/** 打开“关于”对话框 */
export function fetch(name: ServiceName.OpenAboutModal): Promise<FetchData<void>>;
/** 以桌面的默认方式打开文件 */
export function fetch(name: ServiceName.OpenPathDefaultManner): Promise<FetchData<void>>;

/** 打开选择文件（夹）对话框 */
export function fetch(
  name: ServiceName.OpenSelectDialog,
  params?: OpenDialogOptions,
): Promise<FetchData<string[]>>;
/** 打开选择文件（夹）对话框 */
export function fetch(param: FetchParam<OpenDialogOptions>): Promise<FetchData<string[]>>;

/** 打开消息对话框 */
export function fetch(
  name: ServiceName.OpenMessageDialog,
  params?: MessageBoxOptions,
): Promise<FetchData<MessageBoxReturnValue>>;
/** 打开消息对话框 */
export function fetch(
  param: FetchParam<MessageBoxOptions>,
): Promise<FetchData<MessageBoxReturnValue>>;

/** 获取所有标签数据 */
export function fetch(name: ServiceName.GetAllTags): Promise<FetchData<TagGroupData[]>>;

export function fetch<R = any, P = any>(param: FetchParam<P>): Promise<FetchData<R>>;
export function fetch<R = any, P = any>(name: ServiceName, param?: P): Promise<FetchData<R>>;
export function fetch<R = any, P = any>(
  name: ServiceName | FetchParam,
  param?: P,
): Promise<FetchData<R>> {
  return new Promise<FetchData<R>>((resolve, reject) => {
    const currentId = eventId++;
    const data: FetchData = isNumber(name)
      ? {
          name,
          data: param,
          eventId: currentId,
          status: Status.Created,
        }
      : {
          name: name.name,
          data: name.params,
          eventId: currentId,
          status: Status.Created,
        };
    const store: FetchStore = {
      resolve,
      reject,
      eventId: currentId,
      params: data.data,
      name: data.name,
      onProgress: !isNumber(name) ? name.onProgress : undefined,
    };

    if (process.env.NODE_ENV === 'development') {
      log(`前端请求事件 data: ${JSON.stringify(data)}`);
    }

    ipcRenderer.send(FetchEventName, data);

    fetchStore.push(store);
  });
}
