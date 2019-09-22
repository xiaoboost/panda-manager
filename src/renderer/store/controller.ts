import * as fs from 'fs-extra';
import * as path from 'path';

import { remote } from 'electron';

import { Manga } from 'renderer/lib/manga';
import { handleError } from 'renderer/lib/error';
import { TagGroup, TagGroupData } from 'renderer/lib/tag';
import { isString, deleteVal, resolveUserDir } from 'utils/shared';

import {
    mangas,
    reading,
    tagGroups,
    sortOption,
    mangaDirectories,
} from './values';

/** 排序方式 */
export const enum SortBy {
    name,
    lastModified,
    size,
}

/** 排序选项 */
export interface SortOption {
    by: SortBy;
    asc: boolean;
}

/** 配置文件格式 */
interface metaFileData {
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

/** 配置文件名称 */
const metaFileName = 'meta.json';
/** 缓存文件夹路径 */
const userDir = resolveUserDir();
/** 漫画元数据文件夹路径 */
const mangaMetaFolder = Manga.metaData.folder;
/** 缓存文件路径 */
const metaFilePath = resolveUserDir(metaFileName);

/** 读取缓存文件 */
async function readMetaFile() {
    const data = await fs.readJSON(metaFilePath).catch(() => ({})) as Partial<metaFileData>;

    mangaDirectories.value = data.directories || [];
    tagGroups.value = (data.tagGroups || []).map((item) => {
        return new TagGroup(item);
    });

    sortOption.value = {
        ...sortOption.value,
        ...(data.sort || {}),
    };

    if (!fs.existsSync(mangaMetaFolder)) {
        await fs.mkdir(mangaMetaFolder);
    }
}

/** 写缓存 */
async function writeMeta() {
    const data: metaFileData =  {
        tagGroups: tagGroups.origin,
        directories: mangaDirectories.origin,
        sort: sortOption.origin,
    };

    await fs.mkdirp(userDir);
    await fs.writeJSON(metaFilePath, data);
}

/** 读取所有漫画缓存文件夹列表 */
async function readMetaMangaList() {
    const dirs = await fs.readdir(mangaMetaFolder).catch(() => [] as string[]);
    const stats = await Promise.all(dirs.map((dir) => fs.stat(path.join(mangaMetaFolder, dir))));

    return dirs.filter((_, i) => stats[i].isDirectory()).sort((pre, next) => +pre > +next ? 1 : -1);
}

/** 删除多余的缓存文件 */
async function removeExtraCache() {
    const dirs = await fs.readdir(mangaMetaFolder).catch(() => [] as string[]);

    // 删除多余的实际存在的缓存文件（夹）
    for (const dir of dirs) {
        const fullPath = path.join(mangaMetaFolder, dir);
        const stat = await fs.stat(fullPath);
        const isDirectory = stat.isDirectory();

        if (
            (isDirectory && !mangas.value[dir]) ||
            (!isDirectory && dir !== Manga.metaData.meta)
        ) {
            await fs.remove(fullPath);
        }
    }
}

/**
 * 获取待处理的漫画列表
 * @param dirs 待选的刷新文件夹
 * @return {string[]} 漫画列表
 */
async function getMangasList(dirs: string | string[] = mangaDirectories.value) {
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
        for (const willDelete of mangasCached) {
            // 有缓存，但是实际却不存在
            if (!mangasInDir.includes(path.basename(willDelete.file.path))) {
                await fs.remove(willDelete.metaDir);
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
async function refreshMangas(mangaPaths?: string[]) {
    // 没有输入路径则刷新全部
    if (!mangaPaths) {
        mangaPaths = await getMangasList();
    }

    /** 当前窗口 */
    const win = remote.getCurrentWindow();
    /** 待处理漫画的总数量 */
    const total = mangaPaths.length;

    reading.value = true;
    win.setProgressBar(0);

    for (let i = 0; i < total; i++) {
        const fullPath = mangaPaths[i];
        const fullName = path.basename(fullPath);
        const stat = await fs.stat(fullPath);
        const isDirectory = stat.isDirectory();
        const lastModified = new Date(stat.mtime).getTime();
        const cacheManga = Object.values(mangas.origin);

        // 只需要文件夹和 zip 文件后缀的文件
        if (isDirectory || path.extname(fullName) === '.zip') {
            // 从已有缓存中搜索当前漫画
            const isCached = cacheManga.find(({ file }) => file.path === fullPath);

            // 已有缓存
            if (isCached) {
                // 强制刷新或者漫画被修改过
                if (isCached.file.lastModified < lastModified) {
                    await isCached.writeMeta();
                }
            }
            // 新漫画
            else {
                const manga = await Manga.fromPath(fullPath);

                mangas.value[manga.id] = manga;

                await manga.writeMeta();
            }
        }

        win.setProgressBar((i + 1) / total);
    }

    await removeExtraCache();

    reading.value = false;
    win.setProgressBar(-1);
}

/**
 * 刷新漫画缓存
 */
export async function refreshCache() {
    await reading.when(false);
    await refreshMangas();
}

/**
 * 添加文件夹
 * @param {string} 添加的文件夹
 */
export async function addDirectory(dirInput: string) {
    await reading.when(false);

    if (mangaDirectories.value.includes(dirInput)) {
        handleError(101, dirInput);
        return;
    }

    mangaDirectories.value.push(dirInput);

    await writeMeta();
    await refreshMangas(await getMangasList(dirInput));
}

/**
 * 删除文件夹
 * @param {string} 删除的文件夹
 */
export async function removeDirectory(dirInput: string) {    
    await reading.when(false);

    if (!mangaDirectories.value.includes(dirInput)) {
        handleError(100, dirInput);
        return;
    }

    deleteVal(mangaDirectories.value, dirInput);

    const origin = mangas.origin;
    const deleteMangas = Object.values(mangas.origin).filter(({ file }) => file.path.includes(dirInput));

    for (const manga of deleteMangas) {
        delete origin[manga.id];
        await fs.remove(manga.metaDir);
    }

    mangas.dispatch(origin);

    await removeExtraCache();
}

/** 从硬盘中读取缓存 */
async function readMeta() {
    await reading.when(false);

    await readMetaFile();

    reading.value = true;

    // 所有漫画缓存
    const dirs = await readMetaMangaList();
    // 读取所有漫画缓存数据
    const metas = await Promise.all(dirs.map(
        (name) =>
            fs.readJSON(path.join(mangaMetaFolder, name, Manga.metaData.meta))
                .then((item) => Manga.fromMeta(item))
                .catch(() => void 0),
    ));

    const mangasCopy = mangas.origin;

    metas
        .filter((x: any): x is Manga => !!x)
        .forEach((item) => mangasCopy[item.id] = item);

    // 漫画储存值变化
    mangas.dispatch(mangasCopy);

    // 删除多余缓存
    await removeExtraCache();
    // 刷新缓存
    await refreshMangas();

    // 重写缓存
    await writeMeta();

    reading.value = false;
}

/** 绑定写缓存函数 */
function subscribeWrite() {
    [mangas, tagGroups, sortOption].forEach((watcher) => {
        watcher.subscribe(writeMeta);
    });
}

// 初始化
readMeta();
subscribeWrite();
