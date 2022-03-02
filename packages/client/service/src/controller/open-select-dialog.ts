import { dialog } from 'electron';
import { ServiceData } from './types';
import { log } from '@panda/shared';

export const service: ServiceData<Promise<string[]>> = async (context) => {
  const result = await dialog.showOpenDialog(context.window, context.requestData.data);

  if (process.env.NODE_ENV === 'development') {
    log(`选择对话框结果为: ${JSON.stringify(result.filePaths)}`);
  }

  return result.filePaths ?? [];
};
