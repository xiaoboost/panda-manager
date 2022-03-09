import { ipcMain, dialog, BrowserWindow } from 'electron';
import { log } from '@panda/shared';
import { RemoteEventName, RemoteToEvent, RemoteReplyEvent } from '../../shared/dialog';

export function initialize(win: BrowserWindow) {
  ipcMain.handle(RemoteEventName, async (event, params: RemoteToEvent) => {
    if (win.webContents.id !== event.sender.id) {
      return;
    }

    const result: RemoteReplyEvent = {
      returnValue: undefined,
    };

    if (process.env.NODE_ENV === 'development') {
      log(`远程窗口请求 Dialog 模块: ${JSON.stringify(params, null, 2)}`);
    }

    try {
      const args =
        params.key === 'showErrorBox' ? params.params ?? [] : [win].concat(params.params ?? []);
      result.returnValue = await dialog[params.key](...args);
    } catch (e: any) {
      if (process.env.NODE_ENV === 'development') {
        log(`远程窗口请求 Dialog 模块时发生错误: ${e.toString()}`);
      }

      result.error = e.message;
    }

    return result;
  });
}
