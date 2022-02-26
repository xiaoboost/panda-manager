import { dialog, MessageBoxReturnValue } from 'electron';
import { ServiceData } from './types';
import { log } from '@panda/shared';

type Result = Promise<MessageBoxReturnValue>;

export const service: ServiceData<Result> = async ({ window, requestData }) => {
  if (process.env.NODE_ENV === 'development') {
    log(`打开对话框: ${JSON.stringify(requestData)}`);
  }

  const result = await dialog.showMessageBox(window, {
    ...requestData.data,
    noLink: true,
  });

  if (process.env.NODE_ENV === 'development') {
    log(`用户的选择是: ${JSON.stringify(result)}`);
  }

  return result;
};
