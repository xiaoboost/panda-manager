import type { BrowserWindow } from 'electron';
import { RPC } from '@panda/shared';

export interface ServiceData {
  name: RPC.FetchName;
  service(win: BrowserWindow, request: RPC.FetchData): any;
}
