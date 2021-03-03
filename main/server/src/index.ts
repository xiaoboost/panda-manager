import type { IpcMain } from 'electron';

import { route } from './controller';
import { MainEventName, RendererEventName } from '@panda/shared';

export function install(ipcMain: IpcMain) {
  ipcMain.on(MainEventName, (event, param) => {
    route(param).then((result) => {
      event.reply(RendererEventName, {
        ...param,
        data: result,
      });
    });
  });
}
