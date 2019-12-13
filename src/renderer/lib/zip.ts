import fs from 'fs-extra';
import path from 'path';
import JSZip from 'jszip';
// import IconvLite from 'iconv-lite';
import naturalCompare from 'string-natural-compare';

import { handleError } from './print';
import { readdirs } from 'utils/node';

/** 读取压缩包 */
async function readZip(file: string) {
    const stat = await fs.stat(file).catch(() => void 0);

    if (!stat || stat.isDirectory()) {
        handleError('压缩包不存在');
        return;
    }

    // FIXME: zip 文件夹内部路径含有非英文字符绘乱码
    const content = await fs.readFile(file);
    const zip = await JSZip.loadAsync(content, {
        // decodeFileName() {
        // },
    });

    return zip;
}

/** 压缩包写入硬盘 */
function zipToDisk(zip: JSZip, targetFile: string) {
    return zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' })
        .then((data: Buffer) => fs.writeFile(targetFile, data));
}

/** 生成异步文件列表迭代器 */
export async function *zipFiles(file: string) {
    const zip = await readZip(file);

    if (!zip) {
        return;
    }

    // 所有文件
    const files = Object.keys(zip.files).sort(naturalCompare);

    // 迭代所有文件
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = zip.files[file];

        if (data.dir) {
            continue;
        }

        const buffer = await data.async('nodebuffer');

        yield {
            /** 压缩包文件数据 */
            buffer,
            /** 相对于压缩包本身的路径 */
            path: file,
        };
    }
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
    await fs.mkdirp(targetDir);
    // 压缩包写入硬盘
    await zipToDisk(zip, path.join(targetDir, `${fileName}.zip`));
}

/** 解包文件夹 */
export async function unpackZip(file: string, targetDir = path.dirname(file)) {
    // 压缩包的基础名称
    const fileName = path.parse(file).name;
    // 迭代压缩包内的所有文件
    for await (const image of zipFiles(file)) {
        const fileFull = path.join(targetDir, fileName, image.path);
        const fileFullDir = path.dirname(fileFull);

        await fs.mkdirp(fileFullDir);
        await fs.writeFile(fileFull, image.buffer);
    }
}

/** 从压缩包中移除文件 */
export function removeFile(zip: string, files: string[]) {
    //
}
