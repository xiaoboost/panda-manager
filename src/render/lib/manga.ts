import * as fs from 'fs-extra';

import { join } from 'path';
import { clone } from 'render/lib/utils';
import { resolveCache } from 'shared/env';

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
            size: { height: 380 },
        },
        /** 内容 */
        content: {
            quality: 80,
            size: { height: 180 },
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
    /** 当前漫画的缓存路径 */
    get cachePaths() {
        const dir = resolveCache(this.id);
        const meta = join(dir, Manga.metaData.meta);
        const cover = join(dir, Manga.metaData.cover);
        const preview = join(dir, Manga.metaData.preview);

        return { dir, meta, cover, preview };
    }

    /** 从文件夹生成预览 */
    async createPreviewFromDirectory() {
    //     this.previewPositions.length = 0;

    //     let preview = Buffer.from('');
    //     const { content, cover } = Manga.option.compressOption;
    //     const allFiles = (await fs.readdir(this.file.path)).sort(naturalCompare);

    //     for (const file of allFiles) {
    //         const fullPath = join(this.file.path, file);
    //         const stat = await fs.stat(fullPath);

    //         // 跳过目录和不允许的文件后缀
    //         if (stat.isDirectory() || !allowImageExt.includes(extname(file).toLowerCase())) {
    //             continue;
    //         }

    //         // 读取当前图片
    //         const image = await fs.readFile(fullPath);
    //         // 当前图片预览
    //         const currentImage = await compress(image, 'jpg', content);

    //         // 第一页
    //         if (preview.length === 0) {
    //             // 制作封面
    //             await fs.writeFile(
    //                 join(this.cacheDir, 'cover.jpg'),
    //                 await compress(image, 'jpg', cover),
    //             );

    //             preview = currentImage;
    //             this.previewPositions.push(0, sizeOf(preview).width);
    //         }
    //         else {
    //             preview = await imageExtend(preview, currentImage);
    //             this.previewPositions.push(sizeOf(preview).width);
    //         }
    //     }

    //     // 预览文件写入硬盘
    //     await fs.writeFile(
    //         join(this.cacheDir, 'preview.jpg'),
    //         preview,
    //     );
    }
    /** 从压缩包生成预览 */
    async createPreviewFromZip() {
    //     this.previewPositions.length = 0;

    //     let preview = Buffer.from('');
    //     const zip = await Zip.loadZip(this.file.path);
    //     const { content, cover } = Manga.option.compressOption;

    //     for await (const file of zip.files()) {
    //         // 当前图片预览
    //         const currentImage = await compress(file.buffer, 'jpg', content);

    //         // 第一页
    //         if (preview.length === 0) {
    //             // 制作封面
    //             await fs.writeFile(
    //                 join(this.cacheDir, 'cover.jpg'),
    //                 await compress(file.buffer, 'jpg', cover),
    //             );

    //             preview = currentImage;
    //             this.previewPositions.push(0, sizeOf(preview).width);
    //         }
    //         else {
    //             preview = await imageExtend(preview, currentImage);
    //             this.previewPositions.push(sizeOf(preview).width);
    //         }
    //     }

    //     // 预览文件写入硬盘
    //     await fs.writeFile(
    //         join(this.cacheDir, 'preview.jpg'),
    //         preview,
    //     );
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

        const { dir, meta } = this.cachePaths;

        await fs.remove(dir);
        await fs.mkdirp(dir);

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
            meta,
            mangaData,
            process.env.NODE_ENV === 'development'
                ? { replacer: null, spaces: 4 }
                : undefined,
        );
    }
}
