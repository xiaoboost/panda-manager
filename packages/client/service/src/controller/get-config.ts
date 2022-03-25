import { AsyncService } from './types';
import { SettingData } from '@panda/shared';

import { get as getDirectory } from '../service/directories';
import { get as getSort } from '../service/sort';

export const service: AsyncService<SettingData, SettingData> = async () => {
  return {
    directories: await getDirectory(),
    sort: await getSort(),
  };
};
