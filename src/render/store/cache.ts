import * as fs from 'fs-extra';
import * as path from 'path';

import { remote } from 'electron';

import { Manga } from 'render/lib/manga';
import { resolveCache } from 'shared/env';
import { TagGroup, TagGroupData } from 'render/lib/tag';
import { handleError, isString, deleteVal } from 'render/lib/utils';


import {
    mangas,
    loading,
    tagGroups,
    sortOption,
    directories,
} from './values';

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

    directories.value = data.directories || [];

    sortOption.value = {
        ...sortOption.value,
        ...(data.sort || {}),
    };

    if (data.tagGroups) {
        data.tagGroups.forEach((item) => tagGroups.origin[item.id] = TagGroup.from(item));
        tagGroups.dispatch();
    }
}

/** 读取所有漫画缓存文件夹列表 */
async function readCacheMangaList() {
    const dirs = await fs.readdir(cacheDir).catch(() => [] as string[]);
    const stats = await Promise.all(dirs.map((dir) => fs.stat(path.join(cacheDir, dir))));

    return dirs.filter((_, i) => stats[i].isDirectory()).sort((pre, next) => +pre > +next ? 1 : -1);
}

/** 删除多余的缓存文件 */
async function removeExtraCache() {
    const dirs = await fs.readdir(cacheDir).catch(() => [] as string[]);

    // 删除多余的实际存在的缓存文件（夹）
    for (const dir of dirs) {
        const fullPath = path.join(cacheDir, dir);
        const stat = await fs.stat(fullPath);
        const isDirectory = stat.isDirectory();

        if (
            (isDirectory && !mangas.value[dir]) ||
            (!isDirectory && dir !== 'meta.json')
        ) {
            await fs.remove(fullPath);
        }
    }
}

/** 从硬盘中读取缓存 */
async function readCache() {
    await readCacheFile();

    loading.value = true;

    // 所有漫画缓存
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
        .forEach((item) => mangas.origin[item.id] = item);

    // 漫画储存值变化
    mangas.dispatch();

    // 删除多余缓存
    await removeExtraCache();

    // 重写缓存
    await writeCache();

    loading.value = false;
}

/** 写缓存 */
async function writeCache() {
    const data: CacheFileData =  {
        tagGroups: Object.values(tagGroups.origin),
        directories: directories.origin,
        sort: sortOption.origin,
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
 * 获取待处理的漫画列表
 * @param dirs 待选的刷新文件夹
 * @return {string[]} 漫画列表
 */
async function getMangasList(dirs: string | string[] = directories.value) {
    if (isString(dirs)) {
        dirs = [dirs];
    }

    const result: string[] = [];

    // 扫描文件夹列表
    for (const dir of dirs) {
        // 当前文件夹下实际存在的漫画
        const mangasInDir: string[] = await fs.readdir(dir).catch(() => {
            handleError(100, dir);
            return [];
        });

        // 当前文件夹下已经缓存的漫画
        const mangasCached = (
            Object
                .values(mangas.origin)
                .filter(({ file }) => path.dirname(file.path) === dir)
        );

        // 删除已经不存在的缓存
        for (const cache of mangasCached) {
            // 有缓存，但是实际却不存在
            if (!mangasInDir.includes(path.basename(cache.file.path))) {
                await fs.remove(cache.paths.dir);
            }
        }

        // 添加列表
        result.push(...mangasInDir.map((name) => path.join(dir, name)));
    }

    return result;
}

/**
 * 刷新列表的所有漫画
 * @param force 
 */
async function refreshMangas(paths: string[]) {
    /** 当前窗口 */
    const win = remote.getCurrentWindow();
    /** 待处理漫画的总数量 */
    const total = paths.length;

    loading.value = true;
    win.setProgressBar(0);

    for (let i = 0; i < total; i++) {
        const fullPath = paths[i];
        const fullName = path.basename(fullPath);
        const stat = await fs.stat(fullPath);
        const isDirectory = stat.isDirectory();
        const lastModified = new Date(stat.mtime).getTime();

        // 只需要文件夹和 zip 文件后缀的文件
        if (isDirectory || path.extname(fullName) === '.zip') {
            // 从已有缓存中搜索当前漫画
            const cacheManga = Object.values(mangas.origin).find(({ file }) => file.path === fullPath);

            // 已有缓存
            if (cacheManga) {
                // 强制刷新或者漫画被修改过
                if (cacheManga.file.lastModified < lastModified) {
                    await cacheManga.writeCache();
                }
            }
            // 新漫画
            else {
                const manga = new Manga();

                manga.name = path.parse(fullName).name;
                manga.file.path = fullPath;
                manga.file.lastModified = lastModified;
                manga.file.isDirectory = stat.isDirectory();

                mangas.value[manga.id] = manga;

                await manga.writeCache();
            }
        }

        win.setProgressBar(i / total);
    }

    await removeExtraCache();

    loading.value = false;
    win.setProgressBar(-1);
}

/**
 * 刷新漫画缓存
 */
export async function refreshCache() {
    await refreshMangas(await getMangasList());
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

    directories.value.push(dirInput);

    await refreshMangas(await getMangasList(dirInput));
    await writeCache();
}

/**
 * 删除文件夹
 * @param {string} 删除的文件夹
 */
export async function removeDirectory(dirInput: string) {
    if (!directories.value.includes(dirInput)) {
        handleError(100, dirInput);
        return;
    }

    deleteVal(directories.value, dirInput);

    const deleteMangas = Object.values(mangas.origin).filter(({ file }) => file.path.includes(dirInput));

    for (const manga of deleteMangas) {
        delete mangas.origin[manga.id];
        await fs.remove(manga.paths.dir);
    }

    mangas.dispatch();

    await removeExtraCache();
    await writeCache();
}

// 初始化
readCache();
