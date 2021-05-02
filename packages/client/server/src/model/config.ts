import { Model } from '@panda/db';
import { resolveUserDir, SortBy, ConfigData } from '@panda/shared';

/** 初始化默认值 */
const initVal: ConfigData = {
  directories: [],
  sort: {
    by: SortBy.name,
    asc: true,
  },
};

/** 配置数据 */
export const Config = new Model(initVal, resolveUserDir('config'));
