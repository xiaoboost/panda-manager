import { webContents } from 'electron';

import { log } from '@panda/shared';
import { BroadcastData, BroadcastEventName, BroadcastName } from '../shared';

export function broadcast<T = any>(name: BroadcastName, params: T) {
  const data: BroadcastData = {
    name,
    data: params,
  };

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

  webContents.getAllWebContents().forEach((win) => {
    win.send(BroadcastEventName, data);
  });
}
