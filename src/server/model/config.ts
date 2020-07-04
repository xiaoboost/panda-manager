import { Model } from 'src/utils/data/model';
import { resolveUserDir } from 'src/utils/node/env';
import { SortBy, ConfigData } from './types';

/** 配置文件路径 */
const configPath = resolveUserDir('config');

/** 初始化默认值 */
const ininVal: ConfigData = {
    directories: [],
    sort: {
        by: SortBy.name,
        asc: true,
    },
};

/** 配置数据 */
export const Config = new Model(ininVal, configPath);
