import { ServiceData } from './types';
import { SettingData } from '@panda/shared';

import { patch as dirPatch } from '../service/directory';
import { patch as sortPatch } from '../service/sort';

import { service as get } from './get-config';

export const service: ServiceData<Promise<SettingData>> = async (context) => {
  const { requestData: { data } } = context;

  if (data.directories) {
    await dirPatch(data.directories);
  }

  if (data.sort) {
    await sortPatch(data.sort);
  }

  return await get(context);
};
