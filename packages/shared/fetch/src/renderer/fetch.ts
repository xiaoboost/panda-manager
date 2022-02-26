import { ipcRenderer } from 'electron';
import { log } from '@panda/shared';
import { isNumber } from '@xiao-ai/utils';
import { FetchParam, FetchStore } from './types';
import { ServiceName } from '@panda/shared';

import {
  FetchEventName,
  ProgressData,
  ReplyEventName,
  ProgressEventName,
  FetchData,
  Status,
} from '../shared';

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
    }
    else {
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

export function fetch<T = any>(param: FetchParam): Promise<FetchData<T>>;
export function fetch<T = any>(name: ServiceName): Promise<FetchData<T>>;
export function fetch<T = any>(name: ServiceName, param?: any): Promise<FetchData<T>>;
export function fetch<T = any>(name: ServiceName | FetchParam, param?: any): Promise<FetchData<T>> {
  return new Promise<FetchData<T>>((resolve, reject) => {
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
