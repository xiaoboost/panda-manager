import { ServiceData } from './types';
import { SettingData, ServiceName } from '@panda/shared';

import { get as getDirectory } from '../service/directory';
import { get as getSort } from '../service/sort';

export const service: ServiceData = {
  name: ServiceName.GetConfig,
  async service(): Promise<SettingData> {
    return {
      directories: await getDirectory(),
      sort: await getSort(),
    };
  },
};
