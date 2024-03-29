import { ipcRenderer } from 'electron';
import { log } from '@panda/shared';
import { isNumber } from '@xiao-ai/utils';
import { FetchParam, FetchStore } from './types';

import {
  FetchAsyncEventName,
  FetchSyncEventName,
  ProgressData,
  ReplyEventName,
  ProgressEventName,
  FetchData,
  ServiceName,
  Status,
} from '../shared';

let eventId = 0;

const fetchStore: FetchStore[] = [];

// 返回事件
ipcRenderer.on(ReplyEventName, (_, params: FetchData) => {
  if (process.env.NODE_ENV === 'development') {
    log(
      `后端返回异步数据: ${JSON.stringify(
        {
          ...params,
          name: ServiceName[params.name],
          status: Status[params.status],
        },
        null,
        2,
      )}`,
    );
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

  const data = fetchStore.find((ev) => {
    return ev.eventId === params.eventId && ev.name === params.name;
  });

  if (data) {
    data.onProgress?.(params.progress, params.meta);
  }
});

if (process.env.NODE_ENV === 'development') {
  log('Fetch 模块初始化');
}

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
      log(
        `前端请求异步事件 data: ${JSON.stringify(
          {
            ...data,
            name: ServiceName[data.name],
            status: Status[data.status],
          },
          null,
          2,
        )}`,
      );
    }

    ipcRenderer.send(FetchAsyncEventName, data);
    fetchStore.push(store);
  });
}

export function fetchSync<R = any, P = any>(param: FetchParam<P>): FetchData<R>;
export function fetchSync<R = any, P = any>(name: ServiceName, param?: P): FetchData<R>;
export function fetchSync<R = any, P = any>(
  name: ServiceName | FetchParam,
  param?: P,
): FetchData<R> {
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

  if (process.env.NODE_ENV === 'development') {
    log(
      `前端请求同步事件 data: ${JSON.stringify(
        {
          ...data,
          name: ServiceName[data.name],
          status: Status[data.status],
        },
        null,
        2,
      )}`,
    );
  }

  const result = ipcRenderer.sendSync(FetchSyncEventName, data);

  if (process.env.NODE_ENV === 'development') {
    log(
      `后端返回同步数据 data: ${JSON.stringify(
        {
          ...result,
          name: ServiceName[data.name],
          status: Status[data.status],
        },
        null,
        2,
      )}`,
    );
  }

  return result;
}
