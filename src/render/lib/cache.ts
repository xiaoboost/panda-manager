import * as fs from 'fs-extra';
import Manga, { MangaData, TagData, TagsGroupData } from './manga';

import {
    join,
    basename,
    dirname,
    extname,
} from 'path';

import {
    appRoot,
    remove,
    isArray,
    isStrictObject,
    handleError,
} from './utils';

type CacheFileData =
    Pick<AppCache, 'tags' | 'tagsGroups' | 'directories'> &
    { mangas: string[] };

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
            handleError(101, dirInput);
            return;
        }

        this.directories.push(dirInput);

        await this.refreshDirectories(dirInput);
        await this.writeCache();
    }

    /**
     * 刷新所有现存文件的缓存
     * @param {boolean} force 是否强制刷新
     *  - true 将会强制刷新所有漫画缓存（慎用）
     *  - false 只会刷新有修改记录的漫画缓存
     */
    async refreshCache(force = false) {

    }

    /**
     * 刷新文件夹中所包含的文件
     * @param {boolean} force 是否强制刷新
     *  - true 将会强制刷新该文件夹下所有漫画的缓存（慎用）
     *  - false 只会刷新有修改记录的漫画缓存
     */
    async refreshDirectories(dirInput: string, force = false) {
        if (!this.directories.includes(dirInput)) {
            handleError(102, dirInput);
            return;
        }

        // 当前文件夹下已经被缓存的漫画
        const cacheMangas = this.mangas.filter((item) => dirname(item.file.path) === dirInput);
        // 当前文件夹下实际存在的漫画
        const dirMangas: string[] | Error = await fs.readdir(dirInput).catch((e) => e);

        // 发生错误
        if (!isArray(dirMangas)) {
            handleError(100, dirInput);
            remove(this.directories, dirInput);
            return;
        }
        
        // 删除已经不存在的缓存
        await Promise.all(
            cacheMangas
                .filter((item) => !dirMangas.includes(basename(item.file.path)))
                .map((item) => item.remove()),
        );

        // 刷新实际存在的漫画缓存
        for (const name of dirMangas) {
            const fullPath = join(dirInput, name);
            const stat = await fs.stat(fullPath);
            const isDirectory = stat.isDirectory();
            const lastModified = new Date(stat.mtime).getTime();

            // 跳过非 zip 后缀的文件
            if (!isDirectory && extname(name) !== '.zip') {
                continue;
            }

            const manga = new Manga({
                name,
                file: {
                    path: fullPath,
                    isDirectory: stat.isDirectory(),
                    lastModified: new Date(stat.mtime).getTime(),
                },
            });

            await manga.writeCache();
            this.mangas.push(manga);
        }
    }
}

/** 全局缓存 */
export const appCache = new AppCache();
