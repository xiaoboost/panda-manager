
import * as fs from 'fs-extra';

import { join } from 'path';
import { appRoot } from 'lib/utils';

import { Manga } from './manga';
import { TagGroup } from './tag';
import { CacheFileData } from './type';

import {
    sort,
    mangas,
    loading,
    tagGroups,
    directories,
} from './values';

/** 缓存文件名称 */
export const fileName = 'meta.json';
/** 缓存文件夹路径 */
export const cacheDir = join(appRoot, 'cache');
/** 缓存文件路径 */
export const cacheFilePath = join(cacheDir, fileName);
/** 获取缓存路径 */
export const resolveCache = (...paths: (string | number)[]) => {
    return join(cacheDir, ...paths.map(String));
};

/** 读取缓存文件 */
async function readCacheFile() {
    const data = await fs.readJSON(cacheFilePath).catch(() => {}) as Partial<CacheFileData>;

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
    const dirs = await fs.readdir(cacheDir);
    const stats = await Promise.all(dirs.map((dir) => fs.stat(join(cacheDir, dir))));

    return dirs.filter((_, i) => stats[i].isDirectory());
}

/** 删除多余的缓存文件 */
async function removeExtraCache() {
    const dirs = await fs.readdir(cacheDir);

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
    await fs.mkdirp(cacheDir);
    await writeCache();

    loading.dispatch(false);
}

/** 写缓存 */
export async function writeCache() {
    const data: CacheFileData =  {
        tagGroups: Object.values(tagGroups),
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

// 初始化
readCache().then(writeCache);
