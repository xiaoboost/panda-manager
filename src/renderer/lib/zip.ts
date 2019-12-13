import fs from 'fs-extra';
import path from 'path';
import JSZip from 'jszip';
// import IconvLite from 'iconv-lite';
import naturalCompare from 'string-natural-compare';

import { handleError } from './print';

import { readdirs, mkdirp } from 'utils/node';
import { isArray, isString } from 'utils/shared';

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

/** 将压缩包内的文件数据写入硬盘 */
function writeZipInsideFile(writePath: string, data: JSZip.JSZipObject) {
    return new Promise<void>((resolve, reject) => {
        data
            .nodeStream()
            .pipe(fs.createWriteStream(writePath))
            .on('finish', resolve)
            .on('error', reject);
    });
}

/**
 * Zip 压缩包类
 */
export default class Zip {
    /** 读取 zip 文件 */
    static async fromFile(file: string | Buffer) {
        const zip = new Zip(isString(file) ? path.parse(file).name : 'placeholder');

        // const content = await fs.readFile(zipPath);
        // if ()

        // FIXME: zip 文件夹内部路径含有非英文字符绘乱码
        // await zip._zip.loadAsync(content, {
        //     // decodeFileName(bytes: Buffer) {
        //     //     return IconvLite.decode(bytes, 'gbk');
        //     // },
        // });

        // debugger;
        // return zip;
    }
    /** 读取需要压缩的文件夹 */
    static async fromDirectory(directory: string) {
        const { name } = path.parse(directory);
        const zipper = new Zip(name);

        await zipper.append(directory, directory);

        return zipper;
    }

    /** 压缩包数据本体 */
    private _zip: JSZip;

    constructor(name: string) {
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
    async unPack(targetDir: string, progress?: (file: string, progress: number) => void) {
        const errorFiles: string[] = [];
        const fileDirMap: AnyObject<boolean> = {};
        const files = Object.entries(this._zip.files).filter(([, data]) => !data.dir);
        const maxFiles = files.length;

        for (let i = 0; i < maxFiles; i++) {
            const [inner, data] = files[i];
            const filePath = path.join(targetDir, inner);
            const fileDir = path.dirname(filePath);

            // 还未访问过此目录
            if (!fileDirMap[fileDir]) {
                // 标记访问
                fileDirMap[fileDir] = true;
                // 创建目录
                await fs.mkdirp(path.parse(filePath).dir);
            }

            await writeZipInsideFile(filePath, data)
                .catch(() => errorFiles.push(inner))
                .then(() => {
                    if (progress) {
                        progress(inner, ((i + 1) / maxFiles));
                    }
                });
        }
    }
    /** 将压缩包写入硬盘 */
    write(targetDir: string) {
        // const targetFile = path.join(targetDir, `${this.name}.zip`);

        // return new Promise<boolean>((resolve) => {
        //     this._zip
        //         .generateNodeStream({
        //             type: 'nodebuffer',
        //             compression: 'STORE',
        //             streamFiles: true,
        //         })
        //         .pipe(fs.createWriteStream(targetFile))
        //         .on('finish', () => resolve(true))
        //         .on('error', () => {
        //             handleError(handleError.messages.zipBroken, targetFile);
        //             resolve(false);
        //         });
        // });
    }
    /** 生成异步的文件列表迭代器 */
    async *files() {
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

/** 生成异步文件列表迭代器 */
export function *zipFiles(zip: string) {
    // 所有文件
    // const files = Object.keys(this._zip.files).sort(naturalCompare);
}

/** 压缩包写入硬盘 */
function zipToDisk(zip: JSZip, targetFile: string) {
    return zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' })
        .then((data: Buffer) => fs.writeFile(targetFile, data));
}

/** 打包文件夹 */
export async function packageDir(dir: string, targetDir = path.dirname(dir)) {
    const stat = await fs.stat(dir).catch(() => void 0);

    if (!stat || !stat.isDirectory()) {
        handleError('路径不是文件夹');
        return;
    }

    /** 压缩包文件 */
    const zip = new JSZip();
    /** 文件夹名称 */
    const fileName = path.basename(dir);
    /** 文件夹内所有子文件 */
    const files = await readdirs(dir);

    for (let i = 0; i < files.length; i++) {
        const filePath = files[i];
        const relPath = path.relative(dir, filePath);
        const fileContent = await fs.readFile(filePath);

        zip.file(relPath, fileContent);
    }

    // 创建文件夹
    await mkdirp(targetDir);
    // 压缩包写入硬盘
    await zipToDisk(zip, path.join(targetDir, `${fileName}.zip`));
}

/** 解包文件夹 */
export function unpackZip(zip: string, targetDir = path.dirname(zip)) {
    //
}

/** 从压缩包中移除文件 */
export function removeFile(zip: string, files: string[]) {
    //
}
