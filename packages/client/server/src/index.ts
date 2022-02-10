import type { IpcMain } from 'electron';

import { route } from './controller';
import { RPC } from '@panda/shared';

export function install(ipcMain: IpcMain) {
  ipcMain.on(RPC.Description.Main, async (event, param) => {
    const result = await route(param);

    event.reply(RPC.Description.ReplyRenderer, {
      ...param,
      data: result,
    });
  });
}
