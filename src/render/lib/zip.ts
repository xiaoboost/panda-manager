import fs from 'fs-extra';
import JSZip from 'jszip';
import { sep, join, relative } from 'path';

import { handleError } from './error';

const regExpSep = new RegExp(sep, 'g');

/** 读取文件夹内所有文件的路径 */
async function readDir(dir: string) {
    const result: string[] = [];
    const stat = await fs.stat(dir);

    // 该路径是目录
    if (stat.isDirectory()) {
        const files = await fs.readdir(dir);

        for (const file of files) {
            result.push(...await readDir(join(dir, file)))
        }
    }
    // 该路径是文件
    else {
        result.push(dir);
    }

    return result;
}

export default class Zip {
    /** 读取 zip 文件 */
    static async loadZip(zipPath: string) {

    }
    /** 读取需要压缩的文件 */
    static async loadFiles(filesPath: string | string[]) {
        const zipper = new Zip();
        await zipper.append(filesPath);
        return zipper;
    }

    /** 压缩包数据本体 */
    private _zip: JSZip;

    constructor() {
        this._zip = new JSZip();
    }

    /** 添加文件或者文件夹到压缩包 */
    async append(filePaths: string | string[], basePath?: string) {
        const files: string[] = [];

        if (typeof filePaths === 'string') {
            files.push(...await readDir(filePaths));
        }
        else {
            const deepPaths = await Promise.all(filePaths.map(readDir));
            files.push(...deepPaths.reduce((ans, item) => ans.concat(item), []));
        }
        
        for (const filePath of files) {
            const content = await fs.readFile(filePath);
            const path = basePath ? relative(basePath, filePath) : filePath;
            
            this._zip.file(path.replace(regExpSep, '/'), content);
        }
    }
    /** 从压缩包中移除文件 */
    async remove(files: string | string[]) {

        return this;
    }
    /** 解压缩当前压缩包 */
    async unPack(targetDir: string) {

        return this;
    }
    /** 将压缩包写入硬盘 */
    async write(targetDir: string) {

        return this;
    }
}
