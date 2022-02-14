import type { BrowserWindow } from 'electron';
import { RPC } from '@panda/shared';

export interface ServiceData {
  name: RPC.Name;
  service(win: BrowserWindow, request: RPC.Data): any;
}
