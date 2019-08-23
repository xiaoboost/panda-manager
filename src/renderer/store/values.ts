import Watcher from 'renderer/lib/watcher';

import { Manga } from '../lib/manga';
import { TagGroup } from '../lib/tag';
import { SortOption, SortBy } from './controller';

/** 后台线程线程是否被占用 */
export const loading = new Watcher(false);
/** 漫画缓存的文件夹 */
export const directories = new Watcher<string[]>([]);
/** 所有漫画 */
export const mangas = new Watcher<AnyObject<Manga>>({});
/** 所有标签集 */
export const tagGroups = new Watcher<AnyObject<TagGroup>>({});
/** 列表页排序配置 */
export const sortOption = new Watcher<SortOption>({
    by: SortBy.name,
    asc: true,
});
