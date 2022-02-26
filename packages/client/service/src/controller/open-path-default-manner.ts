import { shell } from 'electron';
import { ServiceData } from './types';
import { log } from '@panda/shared';

export const service: ServiceData<Promise<string>> = async ({ requestData }) => {
  if (process.env.NODE_ENV === 'development') {
    log(`打开路径: ${requestData.data.path}`);
  }

  return await shell.openPath(requestData.data.path);
};
