import * as fs from 'fs';
import * as path from 'path';

import { promisify } from 'util';

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const stat = promisify(fs.stat);
export const readdir = promisify(fs.readdir);
export const rm = promisify(fs.unlink);
export const exists = promisify(fs.exists);
export const mkdir = promisify(fs.mkdir);

export {
    existsSync,
} from 'fs';

/** 遍历文件夹下的所有文件 */
async function filesOperation(base: string, opt: (file: string, stat: fs.Stats) => void | Promise<void>) {
    const files = await readdir(base);

    for (let i = 0; i < files.length; i++) {
        const newPath = path.join(base, files[i]);
        const newStat = await stat(newPath);

        if (newStat.isDirectory()) {
            await filesOperation(newPath, opt);
        }
        else {
            await opt(newPath, newStat);
        }
    }
}

/** 求文件夹大小 */
async function folderSize(base: string) {
    let result = 0;

    await filesOperation(base, (_, stat) => {
        result += stat.size;
    });

    return result;
}

/** 读取 json 文件 */
export async function readJSON<T extends object>(path: string): Promise<T | undefined>;
export async function readJSON<T extends object>(path: string, initVal: T): Promise<T>;
export async function readJSON<T extends object>(path: string, initVal?: T) {
    const content = (await readFile(path).catch(() => '')).toString();

    if (!content) {
        return initVal;
    }

    try {
        return JSON.parse(content) as T;
    }
    catch (e) {
        console.warn(e);
        return initVal;
    }
}

/** 获取文件夹内所有文件路径 */
export async function readdirs(base: string) {
    const result: string[] = [];

    await filesOperation(base, (file) => {
        result.push(file);
    });

    return result;
}

/** 获取文件（夹）大小 */
export async function fileSize(base: string) {
    const fileStat = await stat(base);

    if (fileStat.isDirectory()) {
        return await folderSize(base);
    }
    else {
        return fileStat.size;
    }
}

/** 删除文件或文件夹 */
export async function rmrf(base: string) {
    const fileStat = await stat(base);

    if (fileStat.isDirectory()) {
        await filesOperation(base, (file) => rm(file));
    }
    else {
        await rm(base);
    }
}

/** 依照路径创建文件夹 */
export async function mkdirp(target: string) {
    // 待创建的路径
    const dirs: string[] = [];

    let dir = target;

    while (!(await exists(dir))) {
        dirs.push(dir);
        dir = path.dirname(dir);
    }

    while (dirs.length > 0) {
        await mkdir(dirs.shift()!);
    }
}
