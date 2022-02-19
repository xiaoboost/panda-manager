import type { IpcMain, BrowserWindow } from 'electron';

import { route } from './controller';
import { RPC } from '@panda/shared';

export function addFetchListener(win: BrowserWindow, ipcMain: IpcMain) {
  ipcMain.on(RPC.Description.ToMain, async (event, param) => {
    const result = await route(win, {
      ...param,
      rendererId: event.processId,
    });

    event.reply(RPC.Description.ReplyRenderer, {
      ...param,
      data: result,
    });
  });
}
