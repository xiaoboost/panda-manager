import { BrowserWindow } from 'electron';
import { log } from '@panda/shared';

import { initialize as initializeWindow } from './window';
import { initialize as initializeDialog } from './dialog';
import { initialize as initializeShell } from './shell';

export function initialize(win: BrowserWindow) {
  initializeWindow(win);
  initializeDialog(win);
  initializeShell(win);

  if (process.env.NODE_ENV === 'development') {
    log('Remote 模块初始化完成');
  }
}
