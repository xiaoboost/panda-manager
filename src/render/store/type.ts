import { TagGroupData } from './tag-group';

/** 排序方式 */
export const enum SortBy {
    name,
    lastModified,
}

/** 排序选项 */
export interface SortOption {
    by: SortBy;
    asc: boolean;
}

/** 缓存文件格式 */
export interface CacheFileData {
    /** 漫画文件夹存放仓库地址 */
    directories: string[];
    /** 标签集数据 */
    tagGroups: TagGroupData[];
    /** 排序选项 */
    sort: {
        by: SortBy;
        asc: boolean;
    };
}
