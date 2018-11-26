import uuid from 'uuid';
import Zip from 'lib/zip';
import sizeOf from 'image-size';
import * as fs from 'fs-extra';
import { appRoot } from 'lib/utils';
import { join, parse, extname } from 'path';
import { compress, imageExtend } from '../lib/image';
import naturalCompare from 'string-natural-compare';

/** 同人志元数据 */
export interface MangaData {
    /** 显示名称 */
    name: string;
    /** 当前同人志的 ID */
    id: string;
    /** 预览文件坐标 */
    previewPositions: number[];
    /** 当前漫画的 tag 集合 */
    tagGroups: TagGroupData[];

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

/** 标签数据 */
export interface TagData {
    /** 标签的唯一 ID */
    id: string;
    /** 标签名称 */
    name: string;
    /** 标签别名 */
    alias: string[];
}

/** 标签元数据 */
export interface TagGroupData extends TagData {
    /** 标签集合内含标签的 id */
    tags: TagData[];
}

type MangaInput =
    Pick<MangaData, 'name' | 'file'> &
    Partial<Pick<MangaData, 'id' | 'tagGroups'>>;

// 允许的图片后缀
const allowImageExt = ['.bmp', '.jpeg', '.jpg', '.png', '.tiff', '.webp', '.svg'];

/** 同人志数据 */
export default class Manga implements MangaData {
    name: string;
    tagGroups: TagGroupData[];

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
    readonly cachePath: string;

    /** 静态属性配置 */
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
                size: { height: 200 },
            },
        },
    };

    constructor({
        name,
        file,
        id = uuid(),
        tagGroups = [],
    }: MangaInput) {
        this.id = id;
        this.file = { ...file };
        this.name = parse(name).name;
        this.tagGroups = tagGroups;
        this.cachePath = join(appRoot, 'cache', this.id);
    }

    /** 从文件夹生成预览 */
    async createPreviewFromDirectory() {
        this.previewPositions.length = 0;

        let preview = Buffer.from('');
        const { content, cover } = Manga.option.compressOption;
        const allFiles = (await fs.readdir(this.file.path)).sort(naturalCompare);

        for (const file of allFiles) {
            const fullPath = join(this.file.path, file);
            const stat = await fs.stat(fullPath);

            // 跳过目录和不允许的文件后缀
            if (stat.isDirectory() || !allowImageExt.includes(extname(file).toLowerCase())) {
                continue;
            }

            // 读取当前图片
            const image = await fs.readFile(fullPath);
            // 当前图片预览
            const currentImage = await compress(image, 'jpg', content);

            // 第一页
            if (preview.length === 0) {
                // 制作封面
                await fs.writeFile(
                    join(this.cachePath, 'cover.jpg'),
                    await compress(image, 'jpg', cover),
                );

                preview = currentImage;
                this.previewPositions.push(0, sizeOf(preview).width);
            }
            else {
                preview = await imageExtend(preview, currentImage);
                this.previewPositions.push(sizeOf(preview).width);
            }
        }

        // 预览文件写入硬盘
        await fs.writeFile(
            join(this.cachePath, 'preview.jpg'),
            preview,
        );
    }
    /** 从压缩包生成预览 */
    async createPreviewFromZip() {
        this.previewPositions.length = 0;

        let preview = Buffer.from('');
        const zip = await Zip.loadZip(this.file.path);
        const { content, cover } = Manga.option.compressOption;

        for await (const file of zip.files()) {
            // 当前图片预览
            const currentImage = await compress(file.buffer, 'jpg', content);

            // 第一页
            if (preview.length === 0) {
                // 制作封面
                await fs.writeFile(
                    join(this.cachePath, 'cover.jpg'),
                    await compress(file.buffer, 'jpg', cover),
                );

                preview = currentImage;
                this.previewPositions.push(0, sizeOf(preview).width);
            }
            else {
                preview = await imageExtend(preview, currentImage);
                this.previewPositions.push(sizeOf(preview).width);
            }
        }

        // 预览文件写入硬盘
        await fs.writeFile(
            join(this.cachePath, 'preview.jpg'),
            preview,
        );
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
            await this.createPreviewFromDirectory();
        }
        // 当前漫画是压缩包
        else {
            await this.createPreviewFromZip();
        }

        // 写入漫画 metadata 缓存
        await fs.writeJSON(
            join(this.cachePath, 'meta.json'),
            mangaData,
            process.env.NODE_ENV === 'development'
                ? { replacer: null, spaces: 2 }
                : undefined,
        );
    }
}
