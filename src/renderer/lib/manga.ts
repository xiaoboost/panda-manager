import * as fs from 'fs-extra';

import Zip from './zip';
import sizeOf from 'image-size';
import naturalCompare from 'string-natural-compare';

import { join, parse, extname } from 'path';
import { compressImage, concatImage } from './image';

import { getFileSize } from 'utils/node';
import { clone, resolveUserDir, resolveTempDir } from 'utils/shared';

/** 漫画的标签数据 */
export type TagInManga = Array<{
    id: number;
    tags: number[];
}>;

/** 漫画类别枚举 */
export const enum Category {
    Doujinshi,
    Manga,
    ArtistCG,
    GameCG,
    Western,
    NonH,
    ImageSet,
    Cosplay,
    AsianPorn,
    Misc,
}

/** 漫画元数据 */
export interface MangaData {
    /** 显示名称 */
    name: string;
    /** 当前漫画的编号 */
    id: number;
    /** 当前漫画的标签集数据 */
    tagGroups: TagInManga;
    /** 预览图片位置列表 */
    previewPositions: Array<[number, number]>;
    /** 对应的实际文件属性 */
    file: {
        /** 真实文件的路径 */
        path: string;
        /** 真实文件的大小 - 单位 byte */
        size: number;
        /** 此路径是否是文件夹 */
        isDirectory: boolean;
        /** 此文件（夹）最后修改的时间 */
        lastModified: number;
    };
}

export const CategoryMap = {
    [Category.Doujinshi]: {
        label: 'Doujinshi',
        color: '#9E2720',
    },
    [Category.Manga]: {
        label: 'Manga',
        color: '#DB6C24',
    },
    [Category.ArtistCG]: {
        label: 'Artist CG',
        color: '#D38F1D',
    },
    [Category.GameCG]: {
        label: 'Game CG',
        color: '#6A936D',
    },
    [Category.Western]: {
        label: 'Western',
        color: '#AB9F60',
    },
    [Category.NonH]: {
        label: 'Non-H',
        color: '#5FA9CF',
    },
    [Category.ImageSet]: {
        label: 'Image Set',
        color: '#325CA2',
    },
    [Category.Cosplay]: {
        label: 'Cosplay',
        color: '#6A32A2',
    },
    [Category.AsianPorn]: {
        label: 'Asian Porn',
        color: '#A23282',
    },
    [Category.Misc]: {
        label: 'Misc',
        color: '#777777',
    },
};

/** 全局漫画编号 */
let id = 0;
/** 允许的图片后缀 */
const allowImageExt = ['.png', '.jpg', '.jepg', '.bmp'];

/** 漫画类 */
export class Manga implements MangaData {
    id = id++;
    name = '';

    /** 漫画类型 */
    category?: Category;
    /** 漫画标签数据 */
    tagGroups: MangaData['tagGroups'] = [];

    /** 预览图片位置列表 */
    readonly previewPositions: Array<[number, number]> = [];
    /** 漫画对应的实际文件的属性 */
    readonly file: MangaData['file'] = {
        path: '',
        size: 0,
        isDirectory: false,
        lastModified: 0,
    };

    /** 漫画缓存文件配置 */
    static metaData = {
        folder: resolveUserDir('metas'),
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
                height: 400,
            },
        },
        /** 内容 */
        content: {
            quality: 80,
            size: {
                height: 150,
                maxWidth: 220,
            },
        },
    };

    /** 从缓存元数据创建实例 */
    static fromMeta(data: MangaData) {
        const manga = Object.assign(new Manga(), clone(data)) as Manga;

        // 编号重置
        if (data.id >= id) {
            id = data.id + 1;
        }

        return manga;
    }
    /** 从实际文件路径创建实例 */
    static async fromPath(fullPath: string) {
        const manga = new Manga();
        const stat = await fs.stat(fullPath);

        manga.name = parse(fullPath).name;
        manga.file.path = fullPath;
        manga.file.size = await getFileSize(fullPath);
        manga.file.isDirectory = stat.isDirectory();
        manga.file.lastModified = new Date(stat.mtime).getTime();

        return manga;
    }

    /** 当前漫画共多少页 */
    get length() {
        return this.previewPositions.length + 1;
    }
    /** 元数据存放的路径 */
    get metaDir() {
        return join(Manga.metaData.folder, String(this.id));
    }
    /** 元数据路径 */
    get metaPath() {
        return join(this.metaDir, Manga.metaData.meta);
    }
    /** 封面预览路径 */
    get coverPath() {
        return join(this.metaDir, Manga.metaData.cover);
    }
    /** 内容预览路径 */
    get previewPath() {
        return join(this.metaDir, Manga.metaData.preview);
    }
    /** 临时解压路径 */
    get tempPath() {
        return resolveTempDir(this.id);
    }

    /** 从文件夹生成预览 */
    private async createPreviewFromDirectory() {
        this.previewPositions.length = 0;

        let image = Buffer.from('');

        const allFiles = (await fs.readdir(this.file.path)).sort(naturalCompare);

        const { compressOption: option } = Manga;
        const { coverPath: cover, previewPath: preview } = this;

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
            // 压缩图片，生成预览
            const currentPreview = await compressImage(currentImage, {
                type: 'jpg',
                ...option.content,
            });
            // 压缩后的图片大小
            const proviewSize = sizeOf(currentPreview);

            // 第一页
            if (i === 0) {
                // 制作封面
                await fs.writeFile(
                    cover,
                    await compressImage(currentImage, {
                        type: 'jpg',
                        ...option.cover,
                    }),
                );

                image = currentPreview;
            }
            else {
                image = await concatImage(image, currentPreview);
            }

            this.previewPositions.push([
                sizeOf(image).width,
                proviewSize.height,
            ]);
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
        const { coverPath: cover, previewPath: preview } = this;

        for await (const file of zip.files()) {
            // 当前图片预览
            const currentPreview = await compressImage(file.buffer, {
                type: 'jpg',
                ...option.content,
            });
            // 压缩后的图片大小
            const proviewSize = sizeOf(currentPreview);

            // 第一页
            if (this.previewPositions.length === 0) {
                // 生成封面
                await fs.writeFile(
                    cover,
                    await compressImage(file.buffer, {
                        type: 'jpg',
                        ...option.cover,
                    }),
                );

                image = currentPreview;
            }
            else {
                image = await concatImage(image, currentPreview);
            }

            // 合成预览图片
            this.previewPositions.push([
                sizeOf(image).width,
                proviewSize.height,
            ]);
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

            this.writeMeta();
        }
    }
    /** 是否允许生成预览 */
    async allowUpdatePrview() {
        const { previewPath, file } = this;

        // 预览文件不存在
        if (!await fs.pathExists(previewPath)) {
            return true;
        }

        const stat = await fs.stat(file.path);
        const fileLastModified = new Date(stat.mtime).getTime();

        // 漫画预览是旧版
        return fileLastModified > file.lastModified;
    }
    /** 元数据写入硬盘 */
    async writeMeta() {
        const { metaDir, metaPath } = this;

        // 漫画 meta 信息
        const mangaData: MangaData = {
            id: this.id,
            name: this.name,
            file: this.file,
            tagGroups: this.tagGroups,
            previewPositions: this.previewPositions,
        };

        // 文件夹不存在，则创建
        if (!await fs.pathExists(metaDir)) {
            await fs.mkdirp(metaDir);
        }

        await this.createPreview();

        // 写入漫画 metadata 缓存
        await fs.writeJSON(metaPath, mangaData);
    }

    /**
     * 提取至
     *  - 如果是文件夹，则复制
     *  - 如果是压缩包，则解压缩
     */
    async extract(path: string) {
        // ..
    }
    /** 打包文件夹 */
    async archive() {
        // ..
    }
    /** 浏览漫画 */
    async viewManga() {
        let path = '';

        // 是压缩包，先解压到临时目录
        if (!this.file.isDirectory) {
            path = this.tempPath;
        }
        else {
            path = this.file.path;
        }

        // 打开浏览器
    }
    /** 删除自身 */
    async deleteSelf() {
        // ..
    }
}
