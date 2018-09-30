import uuid from 'uuid';
import * as fs from 'fs-extra';
import { join } from 'path';

import {
    omit,
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

type MangaInput =
    Pick<MangaData, 'name' | 'path' | 'isFolder'> &
    Partial<Pick<MangaData, 'id' | 'tagsGroups'>>;

/** 同人志数据 */
class Manga implements MangaData {
    name: string;
    isFolder: boolean;
    tagsGroups: TagsGroupData[];

    readonly id: string;
    readonly path: string;

    /** 当前漫画的缓存数据路径 */
    readonly cachePath = join(appRoot, 'cache', this.id);

    constructor({
        name, path, isFolder,
        id = uuid(),
        tagsGroups = [],
    }: MangaInput) {
        this.name = name;
        this.id = id;
        this.path = path;
        this.isFolder = isFolder;
        this.tagsGroups = tagsGroups;
    }
}

/** 缓存数据 */
class AppCache {
    /** 所有同人志 */
    mangas: Manga[] = [];
    /** 所有标签 */
    tags: AnyObject<TagData> = {};
    /** 所有标签集合 */
    tagsGroups: AnyObject<TagsGroupData> = {};
    /** 当前所有文件夹 */
    directories: string[] = [];

    /** 缓存文件路径 */
    readonly path = join(appRoot, 'cache/meta.json');

    /** 检查数据是否正确 */
    private checkCacheData(data: AnyObject = this) {
        let result = true;

        const arrs = ['mangas', 'directories'];
        const objs = ['tags', 'tagsGroups'];

        for (const key of arrs) {
            if (!isArray(data[key])) {
                result = false;
                data[key] = [];
            }
        }

        for (const key of objs) {
            if (!isStrictObject(data[key])) {
                result = false;
                data[key] = {};
            }
        }

        return result;
    }

    /** 从硬盘读取缓存 */
    async readFromDisk() {
        try {
            const buffer = await fs.readFile(this.path);
            const data = JSON.parse(buffer.toString());

            if (!this.checkCacheData(data)) {
                await this.writeToDisk();
            }

            Object.assign(this, data);
        }
        catch (e) {
            await this.writeToDisk();
        }
    }

    /** 讲缓存写入硬盘 */
    writeToDisk() {
        return fs.writeFile(
            this.path,
            JSON.stringify(omit(this, ['path'])),
        );
    }
}

/** 全局缓存 */
export const appCache = new AppCache();
