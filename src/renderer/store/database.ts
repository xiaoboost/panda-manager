import { Database } from 'utils/node';
import { resolveUserDir } from 'utils/shared';
import { ModuleBaseData } from 'renderer/modules';

/** 全局数据库 */
const database = new Database(resolveUserDir('database'));

/** 标签数据 */
interface TagData {
    /** 标签名称 */
    name: string;
    /** 注释说明 */
    comment: string;
    /** 标签别名 */
    alias: string[];
}

/** 标签集数据 */
interface TagGroupData extends TagData {
    /** 包含的标签编号 */
    tags: number[];
}

/** 文件数据表 */
export const Objects = database.use<ModuleBaseData>('objects');
/** 标签数据表 */
export const Tags = database.use<TagData>('tags');
/** 标签集数据表 */
export const TagGroups = database.use<TagGroupData>('tagGroups');
