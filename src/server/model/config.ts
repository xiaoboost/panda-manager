import { Model } from 'src/server/library/model';
import { resolveUserDir } from 'src/utils/node/env';

/** 配置文件路径 */
const configPath = resolveUserDir('config');

/** 排序方式 */
export const enum SortBy {
    name,
    lastModified,
    size,
}

export interface SortOption {
    by: SortBy;
    asc: boolean;
}

/** 参数选项 */
export interface ConfigData {
    directories: string[];
    sort: SortOption;
}

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
