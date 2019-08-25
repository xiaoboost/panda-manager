import Watcher from 'renderer/lib/watcher';

import { Manga } from '../lib/manga';
import { TagGroup } from '../lib/tag';
import { SortOption, SortBy } from './controller';

/** 读取并生成预览线程是否被占用 */
export const reading = new Watcher(false);
/** 写硬盘线程是否被占用 */
export const writting = new Watcher(false);
/** 压缩线程线程是否被占用 */
export const compressing = new Watcher(false);

/** 漫画缓存的文件夹 */
export const mangaDirectories = new Watcher<string[]>([]);
/** 所有漫画 */
export const mangas = new Watcher<AnyObject<Manga>>({});
/** 所有标签集 */
export const tagGroups = new Watcher<AnyObject<TagGroup>>({});
/** 列表页排序配置 */
export const sortOption = new Watcher<SortOption>({
    by: SortBy.name,
    asc: true,
});
