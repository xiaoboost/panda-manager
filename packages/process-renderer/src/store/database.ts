import { Database } from '@utils/node';
import { resolveUserDir } from '@utils/shared';
import { BaseModuleData } from '@panda/module-controller';

/** 全局数据库 */
const database = new Database(resolveUserDir('database'));

/** 标签基础数据 */
interface TagBaseData {
    /** 标签名称 */
    name: string;
    /** 注释说明 */
    comment: string;
    /** 标签别名 */
    alias: string[];
}

/** 标签数据 */
export interface TagData extends TagBaseData {
    tagGroupId: number;
}

/** 标签集数据 */
export interface TagGroupData extends TagBaseData {
    /** 包含的标签编号 */
    tags: number[];
}

/** 数据库初始化完成 */
export const ready = database.ready;
/** 文件数据表 */
export const Objects = database.use<BaseModuleData>('objects');
/** 标签数据表 */
export const Tags = database.use<TagData>('tags');
/** 标签集数据表 */
export const TagGroups = database.use<TagGroupData>('tagGroups');
