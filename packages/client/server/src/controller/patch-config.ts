import { ServiceData } from './types';
import { RPC, SettingData } from '@panda/shared';

import * as Dir from '../service/directory';
import * as Sort from '../service/sort';

import { service as get } from './get-config';

export const service: ServiceData = {
  name: RPC.Name.PatchConfig,
  async service(request): Promise<SettingData> {
    if (request.data.directories) {
      await Dir.update(request.data.directories);
    }

    if (request.data.sort) {
      await Sort.patch(request.data.sort);
    }

    return await get.service(request);
  },
};
