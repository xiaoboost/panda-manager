import type { IpcMain, BrowserWindow } from 'electron';

import { route } from './controller';
import { RPC, log } from '@panda/shared';

export function addFetchListener(win: BrowserWindow, ipcMain: IpcMain) {
  // 初始化时监听一次返回进程编号
  ipcMain.once(RPC.EventName.GetRendererId, (event) => {
    const id = win.webContents.id;

    if (process.env.NODE_ENV === 'development') {
      log(`first watch on event: GetRendererId - ${id}`);
    }

    event.returnValue = win.webContents.id;
  });

  // 监听渲染进程的 Fetch 事件
  ipcMain.on(RPC.EventName.Fetch, async (event, param) => {
    const data = await route(win, param);

    event.reply(RPC.EventName.ReplyRenderer, {
      ...param,
      data,
    });
  });

  if (process.env.NODE_ENV === 'development') {
    log('Initialize Server');
  }
}
