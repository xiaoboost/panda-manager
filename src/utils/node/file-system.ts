import * as fs from 'fs';
import * as path from 'path';

import { promisify } from 'util';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const remove = promisify(fs.unlink);

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
export async function removeFile(base: string) {
    const fileStat = await stat(base);

    if (fileStat.isDirectory()) {
        await filesOperation(base, (file) => remove(file));
    }
    else {
        await remove(base);
    }
}
