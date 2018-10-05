import uuid from 'uuid';
import Zip from 'lib/zip';
import sizeOf from 'image-size';
import * as fs from 'fs-extra';
import { join, parse } from 'path';
import { appCache } from './cache';
import { appRoot, remove } from 'lib/utils';
import { compress, imageExtend } from './image';

/** 同人志元数据 */
export interface MangaData {
    /** 显示名称 */
    name: string;
    /** 当前同人志的 ID */
    id: string;
    /** 预览文件坐标 */
    previewPositions: number[];
    /** 当前漫画的 tag 集合 */
    tagsGroups: TagsGroupData[];

    /** 对应的实际文件属性 */
    file: {
        /** 真实文件的路径 */
        path: string;
        /** 此路径是否是文件夹 */
        isDirectory: boolean;
        /**此文件（夹）最后修改的时间 */
        lastModified: number;
    };
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
    Pick<MangaData, 'name' | 'file'> &
    Partial<Pick<MangaData, 'id' | 'tagsGroups'>>;

/** 同人志数据 */
export default class Manga implements MangaData {
    name: string;
    tagsGroups: TagsGroupData[];

    file: {
        path: string;
        isDirectory: boolean;
        lastModified: number;
    };

    /** 漫画的唯一编号 */
    readonly id: string;
    /** 预览图片位置列表 */
    readonly previewPositions: number[] = [];
    /** 当前漫画的缓存数据路径 */
    private readonly _cachePath: string;

    /** 静态属性配置 */
    static option = {
        /** 压缩配置 */
        compressOption: {
            /** 封面 */
            cover: {
                quality: 95,
                size: { height: 350 },
            },
            /** 内容 */
            content: {
                quality: 80,
                size: { height: 200 },
            },
        },
    };

    constructor({
        name,
        file,
        id = uuid(),
        tagsGroups = [],
    }: MangaInput) {
        this.name = parse(name).name;
        this.id = id;
        this.file = { ... file };
        this.tagsGroups = tagsGroups;
        this._cachePath = join(appRoot, 'cache', this.id);
    }

    /** 从文件夹生成预览 */
    createPreviewFromDirectory() {

    }
    /** 从压缩包生成预览 */
    async createPreviewFromZip() {
        this.previewPositions.length = 0;

        let image: Buffer;
        const zip = await Zip.loadZip(this.file.path);

        for await (const file of zip.files()) {
            // 封面
            if (file.index === 0) {
                await fs.writeFile(
                    join(this._cachePath, 'cover.jpg'),
                    await compress(file.buffer, 'jpg', Manga.option.compressOption.cover),
                );
            }

            /** 当前图片预览 */
            const currentImage = await compress(file.buffer, 'jpg', Manga.option.compressOption.content);

            // 第一幅预览
            if (file.index === 0) {
                image = currentImage;
                this.previewPositions.push(0);
            }
            // 其他预览图
            else {
                this.previewPositions.push(sizeOf(image!).width);
                image = await imageExtend(image!, currentImage);

                // 最后一幅预览
                if (file.index === file.count - 1) {
                    await fs.writeFile(
                        join(this._cachePath, 'preview.jpg'),
                        image,
                    );
                }
            }
        }
    }

    /** 生成缓存并将其写入硬盘 */
    async writeCache() {
        // 漫画 meta 信息
        const mangaData: MangaData = {
            id: this.id,
            name: this.name,
            file: this.file,
            tagsGroups: this.tagsGroups,
            previewPositions: this.previewPositions,
        };

        await fs.mkdirp(this._cachePath);
        await fs.writeJSON(join(this._cachePath, 'meta.json'), mangaData);

        // 当前漫画是文件夹
        if (this.file.isDirectory) {
            await this.createPreviewFromDirectory();
        }
        // 当前漫画是压缩包
        else {
            await this.createPreviewFromZip();
        }

        console.log('over');
    }

    /** 移除自身缓存 */
    remove() {
        remove(appCache.mangas, this);
        return fs.remove(this._cachePath);
    }
}
