import uuid from 'uuid';
import Zip from 'lib/zip';
import * as fs from 'fs-extra';
import { join, dirname, parse, extname } from 'path';
import { compress, imageExtend } from './image';

import {
    appRoot,
    isArray,
    isStrictObject,
    handleError,
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
    isDirectory: boolean;
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
    Pick<MangaData, 'name' | 'path' | 'isDirectory'> &
    Partial<Pick<MangaData, 'id' | 'tagsGroups'>>;

type CacheFileData =
    Pick<AppCache, 'tags' | 'tagsGroups' | 'directories'> &
    { mangas: string[] };

/** 同人志数据 */
class Manga implements MangaData {
    name: string;
    isDirectory: boolean;
    tagsGroups: TagsGroupData[];

    readonly id: string;
    readonly path: string;

    /** 当前漫画的缓存数据路径 */
    private readonly _cachePath: string;
    /** 预览图片位置列表 */
    private readonly _imagePositions: number[][] = [];

    constructor({
        name,
        path,
        isDirectory,
        id = uuid(),
        tagsGroups = [],
    }: MangaInput) {
        this.name = parse(name).name;
        this.id = id;
        this.path = path;
        this.isDirectory = isDirectory;
        this.tagsGroups = tagsGroups;
        this._cachePath = join(appRoot, 'cache', this.id);
    }

    /** 生成缓存并将其写入硬盘 */
    async writeCache() {
        // 封面配置
        const coverOption = {
            quality: 90,
            size: { height: 280 },
        };
        // 内容配置
        const contentOption = {
            quality: 90,
            size: { height: 200 },
        };
        // 漫画 meta 信息
        const mangaData: MangaData = {
            name: this.name,
            id: this.id,
            path: this.path,
            isDirectory: this.isDirectory,
            tagsGroups: this.tagsGroups,
        };

        await fs.mkdirp(this._cachePath);
        await fs.writeJSON(join(this._cachePath, 'meta.json'), mangaData);

        // 当前漫画是文件夹
        if (this.isDirectory) {

        }
        // 当前漫画是压缩包
        else {
            const zip = await Zip.loadZip(this.path);

            for await (const image of zip.files()) {
                // 封面
                if (image.index === 0) {
                    await fs.writeFile(
                        join(this._cachePath, 'cover.jpg'),
                        await compress(image.buffer, 'jpg', coverOption),
                    );
                }
                
                // 内容
                await fs.writeFile(
                    join(this._cachePath, image.path),
                    await compress(image.buffer, 'jpg', contentOption),
                );
            }
        }
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

    /** 缓存文件名称 */
    readonly fileName = 'meta.json';
    /** 缓存文件夹路径 */
    readonly dirPath = join(appRoot, 'cache');
    /** 缓存文件路径 */
    readonly path = join(this.dirPath, this.fileName);

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
    async readCache() {
        const data = await fs.readJSON(this.path).catch(() => void 0) as CacheFileData;

        // 缓存数据存在
        if (data) {
            this.checkCacheData(data);
            this.tags = data.tags;
            this.tagsGroups = data.tagsGroups;
            this.directories = data.directories;

            // 读取所有漫画缓存数据
            const metas = await Promise.all(
                data.mangas.map(
                    (id) =>
                        fs.readJSON(join(this.dirPath, id, 'meta.json'))
                            .then((data: MangaData) => Promise.resolve(new Manga(data)))
                            .catch(() => void 0)
                ),
            );

            // 过滤错误信息
            this.mangas = metas.filter((item): item is Manga => !!item);

            // 删除多余缓存文件
            const mangaFiles = (await fs.readdir(this.dirPath)).filter((file) => file !== this.fileName);

            await Promise.all(
                mangaFiles
                    .filter((id) => !data.mangas.includes(id))
                    .map((id) => fs.remove(join(this.dirPath, id))),
            );
        }

        // 重写缓存
        await fs.mkdirp(this.dirPath);
        await this.writeCache();
    }

    /** 讲缓存写入硬盘 */
    async writeCache() {
        const data: CacheFileData =  {
            mangas: this.mangas.map((item) => item.id),
            tags: this.tags,
            tagsGroups: this.tagsGroups,
            directories: this.directories,
        };

        await fs.mkdirp(dirname(this.path));
        await fs.writeJSON(this.path, data);
    }

    /** 添加文件夹 */
    async addDirectory(dirInput: string) {
        if (this.directories.includes(dirInput)) {
            handleError(new Error(`This directory is already added: ${dirInput}`));
            return;
        }

        const dirs: string[] = [];

        try {
            const result = await fs.readdir(dirInput);
            dirs.push(...result);
        }
        catch (e) {
            handleError(e);
            return;
        }

        /** 添加文件夹 */
        this.directories.push(dirInput);

        /** 逐个添加文件 */
        for (const name of dirs) {
            const fullPath = join(dirInput, name);
            const stat = await fs.stat(fullPath);
            const isDirectory = stat.isDirectory();

            if (!isDirectory && extname(name) !== '.zip') {
                continue;
            }

            const manga = new Manga({
                name,
                path: fullPath,
                isDirectory: stat.isDirectory(),
            });

            await manga.writeCache();
            this.mangas.push(manga);
        }

        await this.writeCache();
    }
}

/** 全局缓存 */
export const appCache = new AppCache();
