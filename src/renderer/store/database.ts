import { Database } from 'src/utils/node/database';
import { resolveUserDir } from 'src/utils/node/env';

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

/** 文件数据储存数据 */
export interface BaseFileData {
    /** 项目编号 */
    id: number;
    /** 项目名称 */
    name: string;

    /** 此文件由哪个扩展解析 */
    extension: string;
    /** 实际文件路径 */
    filePath: string;
    /** 文件大小 - 单位：kb */
    fileSize: number;
    /** 文件最后修改的时间 */
    lastModified: number;

    /** 标签数据 */
    tags: number[];
}

/** 数据库初始化完成 */
export const ready = database.ready;
/** 文件数据表 */
export const Objects = database.use<BaseFileData>('objects');
/** 标签数据表 */
export const Tags = database.use<TagData>('tags');
/** 标签集数据表 */
export const TagGroups = database.use<TagGroupData>('tagGroups');
