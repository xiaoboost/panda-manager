import * as Module from '../module';

import * as path from 'path';
import * as fs from 'fs-extra';

import ListCover from './list-cover';
import DetailPage from './detail-page';

import { buildPreview, MangaData, Category } from './utils';

/** 漫画类 */
export default class Manga extends Module.BaseModule implements Module.ModuleInstance, MangaData {
    /** 指定为漫画类型 */
    static type = Module.ModuleType.Manga;

    /** 列表封面组件 */
    static ListCover = ListCover;
    /** 详情页面组件 */
    static DetailPage = DetailPage;

    /** 创建元数据 */
    static async from({ file, buffer }: Module.FromContext): Promise<MangaData | undefined> {
        // 跳过非 zip 文件
        if (path.extname(file) !== '.zip') {
            return;
        }

        // 读取压缩包信息
        const fileStat = await fs.stat(file);
        // 生成预览文件数据
        const preview = await buildPreview(await buffer());

        if (!preview) {
            return;
        }

        const manga = new Manga({
            name: path.basename(file),
            filePath: file,
            fileSize: fileStat.size,
            isDirectory: fileStat.isDirectory(),
            lastModified: new Date(fileStat.mtime).getTime(),
            previewPositions: preview.position,
        });

        console.log(manga.id);

        debugger;
        await manga.writePriview(preview);

        return manga.toData();
    }

    /** 指定为漫画类型 */
    type = Module.ModuleType.Manga;

    name: string;
    tags: number[];
    category: Category;

    filePath: string;
    fileSize: number;
    isDirectory: boolean;
    lastModified: number;
    previewPositions: [number, number][];

    constructor(initVal: Partial<MangaData> = {}) {
        super(initVal.id);

        this.name = initVal.name || '';
        this.tags = initVal.tags || [];
        this.category = initVal.category || Category.NonH;
        this.filePath = initVal.filePath || '';
        this.fileSize = initVal.fileSize || 0;
        this.isDirectory = initVal.isDirectory || false;
        this.lastModified = initVal.lastModified || 0;
        this.previewPositions = initVal.previewPositions || [];
    }

    get coverPath() {
        return path.join(this.metaDir, 'cover.jpg');
    }
    get previewPath() {
        return path.join(this.metaDir, 'preview.jpg');
    }

    /** 生成储存用的元数据 */
    toData(): MangaData {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            tags: this.tags.slice(),
            category: this.category,
            filePath: this.filePath,
            fileSize: this.fileSize,
            isDirectory: this.isDirectory,
            lastModified: this.lastModified,
            previewPositions: this.previewPositions.map((item) => item.slice() as [number, number]),
        };
    }
    /** 将预览写入硬盘 */
    async writePriview(data: { cover?: Buffer; thumbnails?: Buffer }) {
        await fs.mkdirp(this.metaDir);

        if (data.cover) {
            await fs.writeFile(this.coverPath, data.cover);
        }

        if (data.thumbnails) {
            await fs.writeFile(this.previewPath, data.thumbnails);
        }
    }
}
