import fs from 'fs-extra';
import path from 'path';
import JSZip from 'jszip';

import { handleError } from './error';
import { isString, isArray } from './assert';

/** 读取文件夹内所有文件的路径 */
async function readDir(dir: string) {
    const result: string[] = [];
    const stat = await fs.stat(dir);

    // 该路径是目录
    if (stat.isDirectory()) {
        const files = await fs.readdir(dir);

        for (const file of files) {
            result.push(...await readDir(path.join(dir, file)))
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
        const zip = new Zip(path.parse(zipPath).name);
        const zipContent = await fs.readFile(zipPath);

        zip._zip.loadAsync(zipContent);

        return zip;
    }
    /** 读取需要压缩的文件 */
    static async loadFiles(filesPath: string | string[]) {
        let currentDir: string;

        if (isString(filesPath)) {
            const stat = await fs.stat(filesPath);
            if (stat.isDirectory()) {
                currentDir = filesPath;
            }
            else {
                currentDir = path.resolve(filesPath, '..');
            }
        }
        else {
            currentDir = path.resolve(filesPath[0], '..');
        }

        const zipper = new Zip(path.parse(currentDir).name);

        await zipper.append(filesPath);
        return zipper;
    }

    /** 压缩包数据本体 */
    private _zip: JSZip;
    /** 压缩包名称 */
    name: string;

    constructor(name: string) {
        this.name = name;
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
            const pathInZip = path.normalize(
                basePath
                    ? path.relative(basePath, filePath)
                    : filePath
            );
            
            this._zip.file(pathInZip, content);
        }
    }
    /** 从压缩包中移除文件 */
    remove(files: string | string[]) {
        const matchs = isArray(files) ? files : [files];

        for (const match of matchs) {
            this._zip.remove(match);
        }
    }
    /** 解压缩当前压缩包 */
    async unPack(targetDir: string) {
        const errorFiles: string[] = [];

        for (const [innerPath, data] of Object.entries(this._zip.files)) {
            if (data.dir) {
                continue;
            }

            const filePath = path.join(targetDir, innerPath);
            const { dir: fileDir } = path.parse(filePath);

            await (new Promise((resolve) => {
                fs.mkdirp(fileDir)
                    .then(() => this._zip
                        .file(innerPath)
                        .nodeStream()
                        .pipe(fs.createWriteStream(filePath))
                        .on('finish', resolve)
                        .on('error', () => {
                            errorFiles.push(innerPath);
                            resolve();
                        })
                    )
                    .catch(() => {
                        errorFiles.push(innerPath);
                        resolve();
                    })
            }));
        }
    }
    /** 将压缩包写入硬盘 */
    write(targetDir: string): Promise<boolean> {
        const targetFile = path.join(targetDir, `${this.name}.zip`);

        return new Promise((resolve) => {
            this._zip
                .generateNodeStream({
                    type: 'nodebuffer',
                    compression: 'STORE',
                    streamFiles: true,
                })
                .pipe(fs.createWriteStream(targetFile))
                .on('finish', () => resolve(true))
                .on('error', (err: Error) => {
                    handleError(err, `Can not write this file: ${targetFile}`);
                    resolve(false);
                });
        });
    }
}
