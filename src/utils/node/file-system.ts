import * as fs from 'fs-extra';
import * as path from 'path';

/** 求文件夹大小 */
async function folderSize(base: string) {
    let result = 0;

    const files = await fs.readdir(base);

    for (let i = 0; i < files.length; i++) {
        const newPath = path.join(base, files[i]);
        const newStat = await fs.stat(newPath);

        if (newStat.isDirectory()) {
            result += await folderSize(newPath);
        }
        else {
            result += newStat.size;
        }
    }

    return result;
}

/** 获取文件（夹）大小 */
export async function getFileSize(base: string) {
    const stat = await fs.stat(base);

    if (!stat.isDirectory()) {
        return stat.size;
    }
    else {
        return await folderSize(base);
    }
}
