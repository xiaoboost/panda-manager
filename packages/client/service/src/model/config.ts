import { Model } from '@panda/db';
import { resolveUserDir } from '@panda/client-utils';
import { SortBy, SettingData } from '@panda/shared';

/** 初始化默认值 */
const initVal: SettingData = {
  directories: [],
  sort: {
    by: SortBy.name,
    asc: true,
  },
};

/** 配置数据 */
export const Config = new Model(initVal, resolveUserDir('config'));
