import { SyncService } from './types';

import os from 'os';

export const service: SyncService<void, string> = () => {
  return [
    `版本: ${process.env.VERSION}`,
    `Electron: ${process.versions.electron}`,
    `Nodejs: ${process.version}`,
    `V8: ${process.versions.v8}`,
    `OS: ${os.type()} ${os.arch()} ${os.release()}`,
  ].join('\n');
};
