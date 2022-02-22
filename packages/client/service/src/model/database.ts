import { Database as DB } from '@panda/db';
import { resolveUserDir } from '@panda/client-utils';
import { TagData, TagGroupData, BaseFileData } from '@panda/shared';

/** 数据库 */
export const Database = new DB(resolveUserDir('database'));

/** 文件数据表 */
export const Files = Database.use<BaseFileData>('file');
/** 标签数据表 */
export const Tags = Database.use<TagData>('tag');
/** 标签集数据表 */
export const TagGroups = Database.use<TagGroupData>('tag-group');
