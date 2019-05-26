import Store from 'render/lib/store';

import { Manga } from '../lib/manga';
import { TagGroup } from '../lib/tag';
import { SortOption, SortBy } from './cache';

/** 后台线程线程是否被占用 */
export const loading = new Store(false);
/** 漫画缓存的文件夹 */
export const directories = new Store<string[]>([]);
/** 所有漫画 */
export const mangas = new Store<AnyObject<Manga>>({});
/** 所有标签集 */
export const tagGroups = new Store<AnyObject<TagGroup>>({});
/** 列表页排序配置 */
export const sortOption = new Store<SortOption>({
    by: SortBy.name,
    asc: true,
});
