import { dialog, clipboard } from 'electron';
import { ServiceData } from './types';
import { log } from '@panda/shared';

import os from 'os';

function getVersion() {
  return [
    `版本: ${process.env.VERSION}`,
    `Electron: ${process.versions.electron}`,
    `Nodejs: ${process.version}`,
    `V8: ${process.versions.v8}`,
    `OS: ${os.type()} ${os.arch()} ${os.release()}`,
  ].join('\n');
}

export const service: ServiceData<void> = async (context) => {
  if (process.env.NODE_ENV === 'development') {
    log('打开“关于”对话框');
  }

  const buttons = ['确定', '复制'];
  const info = getVersion();
  const result = await dialog.showMessageBox(context.window, {
    title: 'Panda Manager',
    message: info,
    type: 'info',
    buttons,
    cancelId: 0,
    noLink: true,
  });

  if (process.env.NODE_ENV === 'development') {
    log(`用户点击按钮：${buttons[result.response]}`);
  }

  if (result.response === 1) {
    clipboard.writeText(info);
  }
};
