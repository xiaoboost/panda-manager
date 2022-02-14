import { ServiceData } from './types';
import { RPC, SettingData } from '@panda/shared';

import * as Dir from '../service/directory';
import * as Sort from '../service/sort';

import { service as get } from './get-config';

export const service: ServiceData = {
  name: RPC.Name.PatchConfig,
  async service(win, request): Promise<SettingData> {
    const { data } = request;

    if (data.directories) {
      await Dir.update(data.directories);
    }

    if (data.sort) {
      await Sort.patch(data.sort);
    }

    return await get.service(win, request);
  },
};
