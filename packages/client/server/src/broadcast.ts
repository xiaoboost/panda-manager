import type { BrowserWindow } from 'electron';

import { RPC } from '@panda/shared';

let eventId = 0;

/** 向前端广播事件 */
export function broadcast(win: BrowserWindow, name: RPC.BroadcastName, data: any) {
  win.webContents.send(`${RPC.Description}_${name}`, {
    name,
    data,
    eventId: eventId++,
    rendererId: win.webContents.id,
    status: RPC.Status.Ok,
  });
}
