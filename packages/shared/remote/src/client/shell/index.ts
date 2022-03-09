import { ipcMain, shell, BrowserWindow } from 'electron';
import { log } from '@panda/shared';
import { RemoteEventName, RemoteToEvent, RemoteReplyEvent } from '../../shared/shell';

export function initialize(win: BrowserWindow) {
  ipcMain.handle(RemoteEventName, (event, params: RemoteToEvent) => {
    if (win.webContents.id !== event.sender.id) {
      return;
    }

    const result: RemoteReplyEvent = {
      returnValue: undefined,
    };

    if (process.env.NODE_ENV === 'development') {
      log(`远程窗口请求 Shell 模块: ${JSON.stringify(params, null, 2)}`);
    }

    try {
      result.returnValue = shell[params.key](...(params.params ?? []));
    } catch (e: any) {
      if (process.env.NODE_ENV === 'development') {
        log(`远程窗口请求 Shell 模块时发生错误: ${e.toString()}`);
      }

      result.error = e.message;
    }

    return result;
  });
}
