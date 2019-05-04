import Store from 'lib/store';

import { SortBy } from './type';
import { Manga } from './manga';
import { TagGroup } from './tag';

/** 当前是否正在等待操作 */
export const loading = new Store(false);
/** 添加的文件夹 */
export const directories = new Store([] as string[]);
/** 漫画缓存 */
export const mangas = new Store({} as AnyObject<Manga>);
/** 标签集缓存 */
export const tagGroups = new Store({} as AnyObject<TagGroup>);
/** 排序选项 */
export const sort = new Store({
    by: SortBy.name,
    asc: true,
});
