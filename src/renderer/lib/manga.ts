import * as fs from 'fs-extra';

import Zip from './zip';
import sizeOf from 'image-size';
import naturalCompare from 'string-natural-compare';

import { clone } from './utils';
import { join, extname } from 'path';
import { resolveCache } from 'src/utils/shared/env';
import { compress, imageExtend } from './image';

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
/** 允许的图片后缀 */
const allowImageExt = ['png', 'jpg', 'bmp'];

/** 漫画类 */
export class Manga implements MangaData {
    id = id++;
    name = '';

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

    /** 漫画缓存文件配置 */
    static metaData = {
        meta: 'meta.json',
        cover: 'cover.jpg',
        preview: 'preview.jpg',
    };
    /** 漫画缓存压缩配置 */
    static compressOption = {
        /** 封面 */
        cover: {
            quality: 95,
            size: {
                height: 380,
            },
        },
        /** 内容 */
        content: {
            quality: 80,
            size: {
                height: 180,
            },
        },
    };

    /** 从缓存创建实例 */
    static fromData(data: MangaData) {
        const manga = Object.assign(new Manga(), clone(data)) as Manga;

        // 编号重置
        if (data.id >= id) {
            id = data.id + 1;
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
    /** 当前漫画的缓存路径 */
    get paths() {
        const dir = resolveCache(this.id);
        const meta = join(dir, Manga.metaData.meta);
        const cover = join(dir, Manga.metaData.cover);
        const preview = join(dir, Manga.metaData.preview);

        return { dir, meta, cover, preview };
    }

    /** 从文件夹生成预览 */
    private async createPreviewFromDirectory() {
            this.previewPositions.length = 0;

            let image = Buffer.from('');

            const allFiles = (await fs.readdir(this.file.path)).sort(naturalCompare);
            const { compressOption: option } = Manga;
            const { paths: { cover, preview }} = this;

            for (let i = 0; i < allFiles.length; i++) {
                const file = allFiles[i];
                const fullPath = join(this.file.path, file);
                const stat = await fs.stat(fullPath);

                // 跳过目录和不允许的文件后缀
                if (stat.isDirectory() || !allowImageExt.includes(extname(file).toLowerCase())) {
                    continue;
                }

                // 读取当前图片
                const currentImage = await fs.readFile(fullPath);
                // 当前图片预览
                const currentPriview = await compress(currentImage, 'jpg', option.content);

                // 第一页
                if (i === 0) {
                    // 制作封面
                    await fs.writeFile(
                        cover,
                        await compress(image, 'jpg', option.cover),
                    );

                    image = currentPriview;
                }
                else {
                    image = await imageExtend(image, currentPriview);
                }

                this.previewPositions.push(sizeOf(currentPriview).width);
            }

            // 预览文件写入硬盘
            await fs.writeFile(preview, image);
    }
    /** 从压缩包生成预览 */
    private async createPreviewFromZip() {
        this.previewPositions.length = 0;

        let image = Buffer.from('');

        const zip = await Zip.fromZipFile(this.file.path);
        const { compressOption: option } = Manga;
        const { paths: { cover, preview }} = this;

        for await (const file of zip.files()) {
            // 当前图片预览
            const currentPreview = await compress(file.buffer, 'jpg', option.content);

            // 第一页
            if (this.previewPositions.length === 0) {
                // 生成封面
                await fs.writeFile(
                    cover,
                    await compress(file.buffer, 'jpg', option.cover),
                );

                image = currentPreview;
            }
            else {
                image = await imageExtend(image, currentPreview);
            }

            // 合成预览图片
            this.previewPositions.push(sizeOf(image).width);
        }

        // 预览文件写入硬盘
        await fs.writeFile(preview, image);
    }

    /** 生成预览 */
    async createPreview() {
        if (await this.allowUpdatePrview()) {
            this.file.isDirectory
                ? await this.createPreviewFromDirectory()
                : await this.createPreviewFromZip();
        }
    }
    /** 是否可以生成缓存 */
    async allowUpdatePrview() {
        const { paths: { preview }, file } = this;

        // 预览文件不存在
        if (!await fs.pathExists(preview)) {
            return true;
        }

        const stat = await fs.stat(file.path);
        const fileLastModified = new Date(stat.mtime).getTime();

        // 漫画预览是旧版
        return fileLastModified > file.lastModified;
    }
    /** 生成缓存并将其写入硬盘 */
    async writeCache() {
        const { dir, meta } = this.paths;

        // 漫画 meta 信息
        const mangaData: MangaData = {
            id: this.id,
            name: this.name,
            file: this.file,
            tagGroups: this.tagGroups,
            previewPositions: this.previewPositions,
        };

        // 文件夹不存在，则创建
        if (!await fs.pathExists(dir)) {
            await fs.mkdirp(dir);
        }

        debugger;
        await this.createPreview();

        // 写入漫画 metadata 缓存
        await fs.writeJSON(
            meta,
            mangaData,
            process.env.NODE_ENV === 'development'
                ? { replacer: null, spaces: 4 }
                : undefined,
        );
    }
}
