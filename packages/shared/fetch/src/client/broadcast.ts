import type { BrowserWindow } from 'electron';

import { log } from '@panda/shared';
import { BroadcastData, BroadcastEventName, BroadcastName } from '../shared';

export function broadcast(win: BrowserWindow, data: BroadcastData) {
  if (process.env.NODE_ENV === 'development') {
    log(
      `后端发送广播数据: ${JSON.stringify(
        {
          ...data,
          name: BroadcastName[data.name],
        },
        null,
        2,
      )}`,
    );
  }

  win.webContents.send(BroadcastEventName, data);
}
