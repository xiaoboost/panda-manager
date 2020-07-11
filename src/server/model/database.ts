import { resolveUserDir } from 'src/utils/node/env';
import { Database as DB } from 'src/utils/data/database';
import { TagData, TagGroupData, BaseFileData } from 'src/utils/typings';

/** 数据库 */
export const Database = new DB(resolveUserDir('database'));

/** 文件数据表 */
export const Objects = Database.use<BaseFileData>('objects');
/** 标签数据表 */
export const Tags = Database.use<TagData>('tags');
/** 标签集数据表 */
export const TagGroups = Database.use<TagGroupData>('tagGroups');
