import uuid from 'uuid';
import * as fs from 'fs-extra';
import { join } from 'path';

import {
    appRoot,
    isArray,
    isStrictObject,
} from './utils';

/** 同人志元数据 */
export interface MangaData {
    /** 显示名称 */
    name: string;
    /** 当前同人志的 ID */
    id: string;
    /** 真实文件存在的路径 */
    path: string;
    /** 当前同人志是否是文件夹 */
    isFolder: boolean;
    /** 当前漫画的 tag 集合 */
    tagsGroups: TagsGroupData[];
}

/** 标签数据 */
export interface TagData {
    /** 标签的唯一 ID */
    id: string;
    /** 标签的真实名称 */
    name: string;
    /** 标签的显示名称 */
    display: string;
}

/** 标签元数据 */
export interface TagsGroupData extends TagData {
    /** 标签集合内含的标签 */
    tags: string[];
}

/** 缓存数据 */
export interface AppCache {
    /** 所有同人志 */
    mangas: MangaData[];
    /** 所有标签 */
    tags: {
        [key: string]: TagData;
    };
    /** 所有标签集合 */
    tagsGroups: {
        [key: string]: TagsGroupData;
    };
}

const CachePath = join(appRoot, 'cache');
const CacheData: AppCache = {
    mangas: [],
    tags: {},
    tagsGroups: {},
};

/** 读取同人志漫画预览数据 */
async function readMangaMeta(id: string) {

}

/** 写缓存 */
export function writeMeta(data: AppCache) {
    return fs.writeFile(
        join(CachePath, 'meta.json'),
        JSON.stringify(data),
    );
}

/** 检查缓存数据是否正确 */
function checkCacheData(data: AppCache) {
    let result = true;

    if (!isArray(data.mangas)) {
        result = false;
        data.mangas = [];
    }

    if (!isStrictObject(data.tags)) {
        result = false;
        data.tags = {};
    }

    if (!isStrictObject(data.tagsGroups)) {
        result = false;
        data.tagsGroups = {};
    }

    return result;
}

/** 初始化 */
export async function init() {
    try {
        const buffer = await fs.readFile(join(CachePath, 'meta.json'));
        const data = JSON.parse(buffer.toString());

        if (!checkCacheData(data)) {
            await writeMeta(data);
        }

        Object.assign(CacheData, data);
    }
    catch (e) {
        await writeMeta(CacheData);
    }
}
