
import * as fs from 'fs-extra';

import { join } from 'path';
import { resolveCache } from 'shared/env';
import { handleError } from 'render/lib/utils';

import { Manga } from './manga';
import { TagGroup, TagGroupData } from './tag';

import {
    sort,
    mangas,
    loading,
    tagGroups,
    directories,
} from '../store';

/** 排序方式 */
export const enum SortBy {
    name,
    lastModified,
}

/** 排序选项 */
export interface SortOption {
    by: SortBy;
    asc: boolean;
}

/** 缓存文件格式 */
interface CacheFileData {
    /** 漫画文件夹存放仓库地址 */
    directories: string[];
    /** 标签集数据 */
    tagGroups: TagGroupData[];
    /** 排序选项 */
    sort: {
        by: SortBy;
        asc: boolean;
    };
}

/** 缓存文件名称 */
const fileName = 'meta.json';
/** 缓存文件夹路径 */
const cacheDir = resolveCache();
/** 缓存文件路径 */
const cacheFilePath = resolveCache(fileName);

/** 读取缓存文件 */
async function readCacheFile() {
    const data = await fs.readJSON(cacheFilePath).catch(() => ({})) as Partial<CacheFileData>;

    tagGroups.dispatch({});
    directories.dispatch([]);

    if (data.tagGroups) {
        data.tagGroups.forEach((item) => tagGroups[item.id] = TagGroup.from(item));
    }

    if (data.directories) {
        directories.dispatch(data.directories);
    }

    if (data.sort) {
        sort.dispatch({
            ...sort.value,
            ...data.sort,
        });
    }
}

/** 读取所有漫画缓存文件夹列表 */
async function readCacheMangaList() {
    const dirs = await fs.readdir(cacheDir).catch(() => [] as string[]);
    const stats = await Promise.all(dirs.map((dir) => fs.stat(join(cacheDir, dir))));

    return dirs.filter((_, i) => stats[i].isDirectory());
}

/** 删除多余的缓存文件 */
async function removeExtraCache() {
    const dirs = await fs.readdir(cacheDir).catch(() => [] as string[]);

    // 删除多余的实际存在的缓存文件（夹）
    for (const dir of dirs) {
        const fullPath = join(cacheDir, dir);
        const stat = await fs.stat(fullPath);
        const isDirectory = stat.isDirectory();

        if (
            (isDirectory && !mangas[dir]) ||
            (!isDirectory && dir !== 'meta.json')
        ) {
            await fs.remove(fullPath);
        }
    }
}

/** 从硬盘中读取缓存 */
export async function readCache() {
    await readCacheFile();

    loading.dispatch(true);

    const dirs = await readCacheMangaList();
    // 读取所有漫画缓存数据
    const metas = await Promise.all(dirs.map(
        (name) =>
            fs.readJSON(resolveCache(name, fileName))
                .then((item) => Manga.fromData(item))
                .catch(() => void 0),
    ));

    metas
        .filter((x: any): x is Manga => !!x)
        .forEach((item) => mangas[item.id] = item);

    // 删除多余缓存
    await removeExtraCache();

    // 重写缓存
    await writeCache();

    loading.dispatch(false);
}

/** 写缓存 */
export async function writeCache() {
    const data: CacheFileData =  {
        tagGroups: Object.values(tagGroups.value),
        directories: directories.value,
        sort: sort.value,
    };

    await fs.mkdirp(cacheDir);
    await fs.writeJSON(
        cacheFilePath,
        data,
        process.env.NODE_ENV === 'development'
            ? { replacer: null, spaces: 4 }
            : undefined,
    );
}

/**
 * 添加文件夹
 * @param {string} 添加的文件夹
 */
export async function addDirectory(dirInput: string) {
    if (directories.value.includes(dirInput)) {
        handleError(101, dirInput);
        return;
    }

    // this.directories.push(dirInput);

    // await this.refreshDirectories(dirInput);
    // await writeCache();
}

/**
 * 删除文件夹
 * @param {string} 删除的文件夹
 */
export async function removeDirectory(dirInput: string) {
    // if (!this.directories.includes(dirInput)) {
    //     handleError(100, dirInput);
    //     return;
    // }

    // remove(this.directories, dirInput);

    // const deleteMangas = this.mangas.filter((item) => item.file.path.includes(dirInput));

    // for (const manga of deleteMangas) {
    //     remove(this.mangas, manga);
    //     await fs.remove(manga.cachePath);
    // }

    // await this.removeExtraCache();
    // await this.writeCache();
}

/**
 * 刷新所有现存文件的缓存
 * @param {boolean} force 是否强制刷新
 *  - true 将会强制刷新所有漫画缓存（慎用）
 *  - false 只会刷新有修改记录的漫画缓存
 */
export async function refreshCache(force = false) {
    // this.isLoading = true;

    // await this.removeExtraCache();

    // for (const dir of this.directories) {
    //     await this.refreshDirectories(dir, force);
    // }

    // this.isLoading = false;
}

/**
 * 刷新文件夹中所包含的文件
 *  - 该刷新将会把某文件夹下的 meta.json 中的多余缓存删除
 * @param {string} dirInput 要刷新的文件夹
 * @param {boolean} force 是否强制刷新
 *  - true 将会强制刷新该文件夹下所有漫画的缓存（慎用）
 *  - false 只会刷新有修改记录的漫画缓存
 */
export async function refreshDirectories(dirInput: string, force?: boolean) {
    // // 输入文件夹不再包含的文件夹之中
    // if (!this.directories.includes(dirInput)) {
    //     handleError(102, dirInput);
    //     return;
    // }

    // this.isLoading = true;

    // // 当前文件夹下已经被缓存的漫画
    // const cacheMangas = this.mangas.filter((item) => dirname(item.file.path) === dirInput);
    // // 当前文件夹下实际存在的漫画
    // const dirMangas: string[] | Error = await fs.readdir(dirInput).catch((e) => e);

    // // 发生错误
    // if (!isArray(dirMangas)) {
    //     handleError(100, dirInput);
    //     remove(this.directories, dirInput);
    //     return;
    // }

    // // 删除已经不存在的缓存
    // await Promise.all(
    //     cacheMangas
    //         .filter((item) => !dirMangas.includes(basename(item.file.path)))
    //         .map((item) => {
    //             remove(this.mangas, item);
    //             return fs.remove(item.cachePath);
    //         }),
    // );

    // // 刷新实际存在的漫画缓存
    // for (let i = 0; i < dirMangas.length; i++) {
    //     const name = dirMangas[i];
    //     const fullPath = join(dirInput, name);
    //     const stat = await fs.stat(fullPath);
    //     const isDirectory = stat.isDirectory();
    //     const lastModified = new Date(stat.mtime).getTime();

    //     // 跳过非 zip 后缀的文件
    //     if (!isDirectory && extname(name) !== '.zip') {
    //         continue;
    //     }

    //     setProgress({
    //         currentPath: fullPath,
    //         jobProgress: {
    //             total: dirMangas.length,
    //             current: i + 1,
    //         },
    //     });

    //     // 从已有缓存中搜索当前漫画
    //     const cacheManga = cacheMangas.find((item) => item.file.path === fullPath);

    //     // 已有缓存
    //     if (cacheManga) {
    //         // 强制刷新或者漫画被修改过
    //         if (force || cacheManga.file.lastModified < lastModified) {
    //             await cacheManga.writeCache();
    //         }
    //     }
    //     // 新漫画
    //     else {
    //         const manga = new Manga({
    //             name,
    //             file: {
    //                 path: fullPath,
    //                 lastModified,
    //                 isDirectory: stat.isDirectory(),
    //             },
    //         });

    //         await manga.writeCache();
    //         this.mangas.push(manga);
    //     }
    // }

    // // 重写缓存
    // await this.writeCache();

    // // 延迟判断是否关闭进度提示
    // setTimeout(() => {
    //     if (!this.isLoading) {
    //         closeProgress();
    //     }
    // }, 100);
}

// 初始化
readCache();
