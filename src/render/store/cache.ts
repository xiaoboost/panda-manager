import * as fs from 'fs-extra';
import { observable as State } from 'mobx';
import { setProgress, closeProgress } from 'components/progress';
import { default as Manga, MangaData, TagGroupData } from './manga';

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
} from '../lib/utils';

/** 缓存数据格式 */
interface CacheFileData {
    mangas: string[];
    directories: string[];
    tagGroups: AnyObject<TagGroupData>;
    sort: {
        by: 'name' | 'lastModified';
        asc: boolean;
    };
}

/** 缓存数据 */
export default class AppCache implements Omit<CacheFileData, 'mangas'> {
    /** 所有同人志 */
    @State
    mangas: Manga[] = [];

    /** 所有标签集合 */
    @State
    tagGroups: AnyObject<TagGroupData> = {};

    /** 当前所有文件夹 */
    @State
    directories: string[] = [];

    /** 初始化是否完成 */
    @State
    isLoading = false;

    /** 排序方式 */
    @State
    sort: CacheFileData['sort'] = {
        by: 'name',
        asc: true,
    };

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
        const objs = ['tagGroups'];

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

        if (!data.sort) {
            data.sort = {
                by: 'name',
                asc: true,
            };
        }

        return result;
    }

    /** 从硬盘读取缓存 */
    async readCache() {
        this.isLoading = true;

        const data = await fs.readJSON(this.path).catch(() => void 0) as CacheFileData;

        // 缓存数据存在
        if (data) {
            this.checkCacheData(data);
            this.tagGroups = data.tagGroups;
            this.directories = data.directories;

            // 读取所有漫画缓存数据
            const metas = await Promise.all(
                data.mangas.map(
                    (id) =>
                        fs.readJSON(join(this.dirPath, id, 'meta.json'))
                            .then((item: MangaData) => new Manga(item))
                            .catch(() => void 0),
                ),
            );

            // 过滤错误信息
            this.mangas = metas.filter((item): item is Manga => !!item);

            // 删除多余缓存文件
            await this.removeExtraCache();
        }

        // 重写缓存
        await fs.mkdirp(this.dirPath);
        await this.writeCache();

        // 完成加载
        this.isLoading = false;
    }

    /** 删除多余的缓存文件 */
    async removeExtraCache() {
        const dirs = await fs.readdir(this.dirPath);

        // 删除多余的实际存在的缓存文件（夹）
        for (const dir of dirs) {
            const fullPath = join(this.dirPath, dir);
            const stat = await fs.stat(fullPath);
            const isDirectory = stat.isDirectory();

            if (
                (isDirectory && !this.mangas.find((item) => item.id === dir)) ||
                (!isDirectory && dir !== 'meta.json')
            ) {
                await fs.remove(fullPath);
            }
        }
    }

    /** 讲缓存写入硬盘 */
    async writeCache() {
        const data: CacheFileData =  {
            mangas: this.mangas.map((item) => item.id),
            tagGroups: this.tagGroups,
            directories: this.directories,
            sort: this.sort,
        };

        await fs.mkdirp(dirname(this.path));
        await fs.writeJSON(
            this.path,
            data,
            process.env.NODE_ENV === 'development'
                ? { replacer: null, spaces: 2 }
                : undefined,
        );
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

    /** 删除文件夹 */
    async removeDirectory(dirInput: string) {
        if (!this.directories.includes(dirInput)) {
            handleError(100, dirInput);
            return;
        }

        remove(this.directories, dirInput);

        const deleteMangas = this.mangas.filter((item) => item.file.path.includes(dirInput));

        for (const manga of deleteMangas) {
            remove(this.mangas, manga);
            await fs.remove(manga.cachePath);
        }

        await this.removeExtraCache();
        await this.writeCache();
    }

    /**
     * 刷新所有现存文件的缓存
     * @param {boolean} force 是否强制刷新
     *  - true 将会强制刷新所有漫画缓存（慎用）
     *  - false 只会刷新有修改记录的漫画缓存
     */
    async refreshCache(force = false) {
        this.isLoading = true;

        await this.removeExtraCache();

        for (const dir of this.directories) {
            await this.refreshDirectories(dir, force);
        }

        this.isLoading = false;
    }

    /** 读取文件夹下的所有漫画基本信息 */
    async readMangaStatFromDirectory(dirInput: string) {
        const allFiles: string[] | Error = await fs.readdir(dirInput).catch((e) => e);

        // 发生错误
        if (!isArray(allFiles)) {
            handleError(100, dirInput);
            remove(this.directories, dirInput);
            return [];
        }

        // 生成目录下所有文件信息
        const fileStat = await Promise.all(allFiles.map(async (name) => {
            const fullPath = join(dirInput, name);
            const stat = await fs.stat(fullPath);

            return {
                name, fullPath,
                isDirectory: stat.isDirectory(),
                lastModified: new Date(stat.mtime).getTime(),
            };
        }));

        // 只需要“文件夹”或者“zip 后缀的文件”
        return fileStat.filter(({ isDirectory, name }) => isDirectory || extname(name) === '.zip');
    }

    /**
     * 刷新文件夹中所包含的文件
     *  - 该刷新将会把某文件夹下的 meta.json 中的多余缓存删除
     * @param {string} dirInput 要刷新的文件夹
     * @param {boolean} force 是否强制刷新
     *  - true 将会强制刷新该文件夹下所有漫画的缓存（慎用）
     *  - false 只会刷新有修改记录的漫画缓存
     */
    async refreshDirectories(dirInput: string, force?: boolean) {
        // 输入文件夹不再包含的文件夹之中
        if (!this.directories.includes(dirInput)) {
            handleError(102, dirInput);
            return;
        }

        this.isLoading = true;

        // 当前文件夹下已经被缓存的漫画
        const cacheMangas = this.mangas.filter((item) => dirname(item.file.path) === dirInput);
        // 当前文件夹下实际存在的漫画
        const mangaStats = await this.readMangaStatFromDirectory(dirInput);

        // 删除已经不存在的缓存
        await Promise.all(
            cacheMangas
                .filter(
                    (item) => !mangaStats.find(
                        ({ fullPath }) =>
                            fullPath === basename(item.file.path),
                    ),
                )
                .map((item) => {
                    remove(this.mangas, item);
                    return fs.remove(item.cachePath);
                }),
        );

        // 刷新实际存在的漫画缓存
        for (let i = 0; i < mangaStats.length; i++) {
            const {
                name,
                fullPath,
                isDirectory,
                lastModified,
            } = mangaStats[i];

            setProgress({
                currentPath: fullPath,
                jobProgress: {
                    total: mangaStats.length,
                    current: i + 1,
                },
            });

            // 从已有缓存中搜索当前漫画
            const cacheManga = cacheMangas.find((item) => item.file.path === fullPath);

            // 已有缓存
            if (cacheManga) {
                // 强制刷新或者漫画被修改过
                if (force || cacheManga.file.lastModified < lastModified) {
                    await cacheManga.writeCache();
                }
            }
            // 新漫画
            else {
                const manga = new Manga({
                    name,
                    file: {
                        path: fullPath,
                        lastModified,
                        isDirectory,
                    },
                });

                await manga.writeCache();
                this.mangas.push(manga);
            }
        }

        // 重写缓存
        await this.writeCache();

        // 延迟判断是否关闭进度提示
        this.isLoading = false;
        setTimeout(() => {
            if (!this.isLoading) {
                closeProgress();
            }
        }, 100);
    }
}
