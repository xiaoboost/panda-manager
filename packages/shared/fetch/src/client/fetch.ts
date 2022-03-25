import { ipcMain, BrowserWindow } from 'electron';
import { log } from '@panda/shared';

import {
  FetchAsyncEventName,
  FetchSyncEventName,
  ProgressData,
  ReplyEventName,
  ProgressEventName,
  ServiceName,
  FetchData,
  Status,
} from '../shared';

export { FetchData, Status, ServiceName } from '../shared';

/** 异步服务上下文 */
export interface AsyncListenerContext<T = any> extends SyncListenerContext<T> {
  sendProgress(progress: number): void;
}

/** 同步服务上下文 */
export interface SyncListenerContext<T = any> {
  window: BrowserWindow;
  requestData: FetchData<T>;
}

export interface ListenerOptions {
  async: (context: AsyncListenerContext) => any;
  sync: (context: SyncListenerContext) => any;
}

export function initialize(win: BrowserWindow, listener: ListenerOptions) {
  ipcMain.on(FetchAsyncEventName, async (event, param) => {
    const requestData: FetchData = {
      ...param,
      status: Status.Ok,
    };

    if (process.env.NODE_ENV === 'development') {
      log(
        `异步服务器接收前端数据为: ${JSON.stringify(
          {
            ...requestData,
            name: ServiceName[requestData.name],
            status: Status[requestData.status],
          },
          null,
          2,
        )}`,
      );
    }

    let result: FetchData;

    try {
      result = await listener.async({
        window: win,
        requestData,
        sendProgress: (progress: number) => {
          const progressEvent: ProgressData = {
            name: result.name,
            eventId: result.eventId,
            progress,
          };

          win.webContents.send(ProgressEventName, progressEvent);
        },
      });
    } catch (e: any) {
      result = {
        ...requestData,
        error: e.message,
        status: Status.ServerError,
      };
    }

    if (process.env.NODE_ENV === 'development') {
      log(
        `异步服务器返回前端数据: ${JSON.stringify(
          {
            ...result,
            name: ServiceName[requestData.name],
            status: Status[requestData.status],
          },
          null,
          2,
        )}`,
      );
    }

    win.webContents.send(ReplyEventName, result);
  });

  ipcMain.on(FetchSyncEventName, (event, param) => {
    const requestData: FetchData = {
      ...param,
      status: Status.Ok,
    };

    if (process.env.NODE_ENV === 'development') {
      log(
        `同步服务器接收前端数据为: ${JSON.stringify(
          {
            ...requestData,
            name: ServiceName[requestData.name],
            status: Status[requestData.status],
          },
          null,
          2,
        )}`,
      );
    }

    let result: FetchData;

    try {
      result = listener.sync({
        window: win,
        requestData,
      }) as FetchData;
    } catch (e: any) {
      result = {
        ...requestData,
        error: e.message,
        status: Status.ServerError,
      };
    }

    if (process.env.NODE_ENV === 'development') {
      log(
        `同步服务器返回前端数据: ${JSON.stringify(
          {
            ...result,
            name: ServiceName[requestData.name],
            status: Status[requestData.status],
          },
          null,
          2,
        )}`,
      );
    }

    event.returnValue = result;
  });

  if (process.env.NODE_ENV === 'development') {
    log('Fetch 模块初始化完成');
  }
}
