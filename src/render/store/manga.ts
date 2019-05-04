import * as fs from 'fs-extra';

import { join } from 'path';
import { clone } from 'lib/utils';
import { resolveCache } from './cache';

/** 漫画的标签数据 */
interface TagInManga {
    id: number;
    tags: number[];
}

/** 漫画元数据 */
export interface MangaData {
    /** 显示名称 */
    name: string;
    /** 当前漫画的编号 */
    id: number;
    /** 当前漫画的标签集数据 */
    tagGroups: TagInManga[];
    /** 预览图片位置列表 */
    previewPositions: number[];

    /** 对应的实际文件属性 */
    file: {
        /** 真实文件的路径 */
        path: string;
        /** 此路径是否是文件夹 */
        isDirectory: boolean;
        /** 此文件（夹）最后修改的时间 */
        lastModified: number;
    };
}

/** 全局漫画编号 */
let id = 0;

/** 漫画类 */
export class Manga implements MangaData {
    name = '';
    id = id++;

    /** 预览图片位置列表 */
    readonly previewPositions: number[] = [];
    /** 漫画标签数据 */
    readonly tagGroups: MangaData['tagGroups'] = [];
    /** 漫画对应的实际文件的属性 */
    readonly file: MangaData['file'] = {
        path: '',
        isDirectory: false,
        lastModified: 0,
    };

    /** 漫画缓存配置 */
    static option = {
        /** 压缩配置 */
        compressOption: {
            /** 封面 */
            cover: {
                quality: 95,
                size: { height: 380 },
            },
            /** 内容 */
            content: {
                quality: 80,
                size: { height: 180 },
            },
        },
    };

    /** 从缓存创建实例 */
    static fromData(data: MangaData) {
        const manga = Object.assign(new Manga(), clone(data)) as Manga;

        // 编号重置
        if (data.id > id) {
            id = data.id;
        }

        return manga;
    }

    /** 从路径创建实例 */
    static fromPath(path: string) {

        return new Manga();
    }

    /** 当前漫画共多少页 */
    get length() {
        return this.previewPositions.length + 1;
    }
    /** 当前漫画的缓存数据位置 */
    get cachePath() {
        return resolveCache(this.id);
    }

    /** 生成缓存并将其写入硬盘 */
    async writeCache() {
        // 漫画 meta 信息
        const mangaData: MangaData = {
            id: this.id,
            name: this.name,
            file: this.file,
            tagGroups: this.tagGroups,
            previewPositions: this.previewPositions,
        };

        await fs.remove(this.cachePath);
        await fs.mkdirp(this.cachePath);

        // 当前漫画是文件夹
        if (this.file.isDirectory) {
            // await this.createPreviewFromDirectory();
        }
        // 当前漫画是压缩包
        else {
            // await this.createPreviewFromZip();
        }

        // 写入漫画 metadata 缓存
        await fs.writeJSON(
            join(this.cachePath, 'meta.json'),
            mangaData,
            process.env.NODE_ENV === 'development'
                ? { replacer: null, spaces: 4 }
                : undefined,
        );
    }
}
