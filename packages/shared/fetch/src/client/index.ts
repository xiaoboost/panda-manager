import { ipcMain, BrowserWindow } from 'electron';
import { log } from '@panda/shared';

import {
  FetchEventName,
  ProgressData,
  ReplyEventName,
  ProgressEventName,
  FetchData,
  Status,
} from '../shared';

export {
  FetchData,
  Status,
} from '../shared';

/** 监听服务上下文 */
export interface ListenerContext {
  window: BrowserWindow;
  requestData: FetchData;
  sendProgress(progress: number): void;
}

/** 监听服务 */
export type Listener = (context: ListenerContext) => any;

export function initialize(win: BrowserWindow, listener: Listener) {
  ipcMain.on(FetchEventName, async (event, param) => {
    const requestData: FetchData = {
      ...param,
      status: Status.Ok,
    };

    if (process.env.NODE_ENV === 'development') {
      log(`Service receive data: ${JSON.stringify(requestData, null, 2)}`);
    }

    let result: FetchData;

    try {
      result = await listener({
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
    }
    catch (e: any) {
      result = {
        ...requestData,
        error: e.message,
        status: Status.ServerError,
      };
    }

    if (process.env.NODE_ENV === 'development') {
      log(`Service reply data: ${JSON.stringify(result, null, 2)}`);
    }

    win.webContents.send(ReplyEventName, result);
  });

  if (process.env.NODE_ENV === 'development') {
    log('Initialize Server');
  }
}
