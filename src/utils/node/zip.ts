import path from 'path';
import JSZip from 'jszip';
import IconvLite from 'iconv-lite';
import naturalCompare from 'string-natural-compare';

import * as fs from '../node/file-system';

import { isString } from '../shared/assert';

/** 读取压缩包 */
async function readZip(file: string | Buffer) {
    const opt: JSZip.JSZipLoadOptions = {
        decodeFileName(bytes: Buffer) {
            return IconvLite.decode(bytes, 'gbk');
        },
    } as any;

    const buf = isString(file) ? await fs.readFile(file) : file;
    const zip = await JSZip.loadAsync(buf, opt);

    return zip;
}

/** 压缩包写入硬盘 */
function writeZip(zip: JSZip, targetFile: string) {
    return new Promise((resove) => {
        zip.generateNodeStream({ type: 'nodebuffer', compression: 'STORE' })
            .pipe(fs.createWriteStream(targetFile))
            .on('finish', resove);
    });
}

/** 生成异步文件列表迭代器 */
export async function *zipFiles(file: string | Buffer) {
    const zip = await readZip(file);

    if (!zip) {
        return;
    }

    // 所有文件
    const files = Object.keys(zip.files)
        .filter((name) => !zip.files[name].dir)
        .sort(naturalCompare);

    // 迭代所有文件
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = zip.files[file];
        const buffer = await data.async('nodebuffer');

        yield {
            /** 压缩包文件数据 */
            buffer,
            /** 相对于压缩包本身的路径 */
            path: file,
            /** 下标 */
            index: i,
        };
    }
}

/** 打包文件夹 */
export async function packageDir(dir: string, targetDir = path.dirname(dir)) {
    const stat = await fs.stat(dir).catch(() => void 0);

    if (!stat || !stat.isDirectory()) {
        console.error('路径不是文件夹');
        return;
    }

    /** 压缩包文件 */
    const zip = new JSZip();
    /** 文件夹名称 */
    const fileName = path.basename(dir);
    /** 文件夹内所有子文件 */
    const files = await fs.readdirs(dir);

    for (let i = 0; i < files.length; i++) {
        const filePath = files[i];
        const relPath = path.relative(dir, filePath);
        const fileContent = await fs.readFile(filePath);

        zip.file(relPath, fileContent);
    }

    // 创建文件夹
    await fs.mkdirp(targetDir);
    // 压缩包写入硬盘
    await writeZip(zip, path.join(targetDir, `${fileName}.zip`));
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
