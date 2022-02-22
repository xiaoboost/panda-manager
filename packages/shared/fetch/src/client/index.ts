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

/** 服务上下文 */
export interface ServiceContext {
  window: BrowserWindow;
  requestData: FetchData;
  sendProgress(progress: number): void;
}

/** 后端服务 */
export type Service = (context: ServiceContext) => any;

export function initialize(win: BrowserWindow, service: Service) {
  ipcMain.on(FetchEventName, async (event, param) => {
    const result: FetchData = {
      ...param,
      status: Status.Ok,
    };

    if (process.env.NODE_ENV === 'development') {
      log(`Service receive data: ${JSON.stringify(result, null, 2)}`);
    }

    event.stopPropagation();
    event.stopImmediatePropagation();

    try {
      result.data = await service({
        window: win,
        requestData: result,
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
      result.error = e.message;
      result.status = Status.ServerError;
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
