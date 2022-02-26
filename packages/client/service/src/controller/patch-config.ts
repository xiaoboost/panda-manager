import { ServiceData } from './types';
import { SettingData } from '@panda/shared';

import * as Dir from '../service/directory';
import * as Sort from '../service/sort';

import { service as get } from './get-config';

export const service: ServiceData<Promise<SettingData>> = async (context) => {
  const { requestData: { data } } = context;

  if (data.directories) {
    await Dir.update(data.directories);
  }

  if (data.sort) {
    await Sort.patch(data.sort);
  }

  return await get(context);
};
