import fs from 'fs-extra';
import path from 'path';
import JSZip from 'jszip';
import naturalCompare from 'string-natural-compare';

import {
    isArray,
    isString,
    handleError,
} from 'render/lib/utils';

/**
 * 读取文件子路径
 * @param {string} dir 输入路径
 *  - 如果 dir 是文件，那么返回只包含它本身的数组
 *  - 如果 dir 是文件夹，则返回它内部所有文件的路径（子文件夹不包含在内）
 */
async function readDir(dir: string) {
    const stat = await fs.stat(dir);

    // 该路径是目录
    if (stat.isDirectory()) {
        const result: string[] = [];
        const files = await fs.readdir(dir);

        for (const file of files) {
            const child = path.join(dir, file);
            const childStat = await fs.stat(child);

            if (!childStat.isDirectory()) {
                result.push(child);
            }
        }

        return result;
    }
    // 该路径是文件
    else {
        return [dir];
    }
}

/**
 * Zip 压缩包类
 */
export default class Zip {
    /** 读取 zip 文件 */
    static async loadZip(zipPath: string) {
        const zip = new Zip(path.parse(zipPath).name);
        const content = await fs.readFile(zipPath);

        await zip._zip.loadAsync(content);

        return zip;
    }
    /** 读取需要压缩的文件夹 */
    static async loadDirectory(directory: string) {
        const { name } = path.parse(directory);
        const zipper = new Zip(name);

        await zipper.append(directory, directory);
        return zipper;
    }

    /** 压缩包数据本体 */
    private _zip: JSZip;

    /**
     * 压缩包名称
     *  - 不包含 .zip 后缀
     */
    name: string;

    constructor(name: string) {
        this.name = name;
        this._zip = new JSZip();
    }

    /** 添加文件或者文件夹到压缩包 */
    async append(inputs: string | string[], basePath?: string) {
        const paths = isString(inputs) ? [inputs] : inputs;
        const deepPaths = await Promise.all(paths.map(readDir));
        const files = deepPaths.reduce((ans, item) => ans.concat(item), []);

        for (const filePath of files) {
            const content = await fs.readFile(filePath);
            const pathInZip = path.normalize(
                basePath
                    ? path.relative(basePath, filePath)
                    : filePath,
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
                    .then(() => data
                        .nodeStream()
                        .pipe(fs.createWriteStream(filePath))
                        .on('finish', resolve)
                        .on('error', () => {
                            errorFiles.push(innerPath);
                            resolve();
                        }),
                    )
                    .catch(() => {
                        errorFiles.push(innerPath);
                        resolve();
                    });
            }));
        }
    }
    /** 将压缩包写入硬盘 */
    write(targetDir: string) {
        const targetFile = path.join(targetDir, `${this.name}.zip`);

        return new Promise<boolean>((resolve) => {
            this._zip
                .generateNodeStream({
                    type: 'nodebuffer',
                    compression: 'STORE',
                    streamFiles: true,
                })
                .pipe(fs.createWriteStream(targetFile))
                .on('finish', () => resolve(true))
                .on('error', () => {
                    handleError(104, targetFile);
                    resolve(false);
                });
        });
    }
    /** 生成异步的文件列表迭代器 */
    async * files() {
        // 所有文件
        const files = Object.keys(this._zip.files).sort(naturalCompare);

        // 异步迭代所有文件
        for (const key of files) {
            const data = this._zip.files[key];

            if (data.dir) {
                continue;
            }

            const buffer = await data.async('nodebuffer');

            yield {
                buffer,
                path: key,
                count: files.length,
                name: path.basename(key),
                lastModify: new Date(data.date).getTime(),
            };
        }
    }
}
