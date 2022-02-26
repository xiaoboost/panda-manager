import { dialog } from 'electron';
import { ServiceData } from './types';

import os from 'os';

function getVersion() {
  return [
    `版本: ${process.env.VERSION}`,
    `Electron: ${process.versions.electron}`,
    `Nodejs: ${process.version}`,
    `V8: ${process.versions.v8}`,
    `OS: ${os.type()} ${os.arch()} ${os.release()}`
  ].join('\n');
}

export const service: ServiceData<void> = (context) => {
  dialog.showMessageBox(context.window, {
    title: 'Panda Manager',
    message: getVersion(),
    type: 'info',
    buttons: ['确定'],
  });
};
