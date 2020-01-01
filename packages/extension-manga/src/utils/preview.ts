import * as path from 'path';
import * as fs from '@utils/node/file-system';

import naturalCompare from 'string-natural-compare';

import { imageSize } from 'image-size';
import { isString } from '@utils/shared';
import { zipFiles } from '@utils/modules/zip';
import { isImage, compress, concat } from '@utils/modules/image';

import { coverPath, previewPath } from './path';

/** 预览数据 */
interface Preview {
    cover: Buffer;
    thumbnails: Buffer;
    position: [number, number][];
}

/** 封面图片参数 */
const CoverCompress = {
    quality: 90,
    size: {
        height: 400,
    },
};

/** 预览图片参数 */
const PriviewCompress = {
    quality: 80,
    size: {
        maxHeight: 142,
        width: 100,
    },
};

/** 有效图片数量 */
const leastNumber = 3;

async function fromDir(dir: string): Promise<Preview | undefined> {
    /** 封面图片数据 */
    let cover = Buffer.from('');
    /** 预览图片数据 */
    let thumbnails = Buffer.from('');
    /** 预览图片的位置信息 */
    const position: [number, number][] = [];
    /** 文件夹内所有文件 */
    const allFiles = (await fs.readdirs(dir)).sort(naturalCompare);

    for (let i = 0; i < allFiles.length; i++) {
        const file = allFiles[i];

        // 当前图片
        const image = await fs.readFile(file);

        // 跳过不允许的文件后缀
        if (!isImage(image)) {
            continue;
        }

        // 生成预览图片
        const preview = await compress(image, {
            type: 'jpg',
            ...PriviewCompress,
        });

        // 第一页
        if (i === 0) {
            // 预览图片
            thumbnails = preview;
            // 压缩首页
            cover = await compress(image, {
                type: 'jpg',
                ...CoverCompress,
            });
        }
        else {
            thumbnails = await concat(thumbnails, preview);
        }

        // 记录当前图片在预览总图中右下角的坐标
        position.push([
            imageSize(thumbnails).width!,
            imageSize(preview).height!,
        ]);
    }

    // 如果少于 3 张图片，则跳过
    if (position.length <= leastNumber) {
        return;
    }

    return {
        cover,
        thumbnails,
        position,
    };
}

async function fromZip(zip: string | Buffer): Promise<Preview | undefined> {
    /** 封面图片数据 */
    let cover = Buffer.from('');
    /** 预览图片数据 */
    let thumbnails = Buffer.from('');
    /** 预览图片的位置信息 */
    const position: [number, number][] = [];

    // 迭代压缩包内的数据
    for await (const { buffer, index } of zipFiles(zip)) {
        // 跳过不允许的文件后缀
        if (!isImage(buffer)) {
            continue;
        }

        // 当前图片
        const image = buffer;
        // 生成预览图片
        const preview = await compress(image, {
            type: 'jpg',
            ...PriviewCompress,
        });

        // 第一页
        if (index === 0) {
            // 预览图片
            thumbnails = preview;
            // 压缩首页
            cover = await compress(image, {
                type: 'jpg',
                ...CoverCompress,
            });
        }
        else {
            thumbnails = await concat(thumbnails, preview);
        }

        // 记录当前图片在预览总图中右下角的坐标
        position.push([
            imageSize(thumbnails).width!,
            imageSize(preview).height!,
        ]);
    }

    // 如果少于 3 张图片，则跳过
    if (position.length <= leastNumber) {
        return;
    }

    return {
        cover,
        thumbnails,
        position,
    };
}

/** 生成预览数据 */
export async function buildPreview(file: string | Buffer) {
    if (!isString(file)) {
        return await fromZip(file);
    }

    const stat = await fs.stat(file);

    if (stat.isDirectory()) {
        return await fromDir(file);
    }
    else {
        return await fromZip(file);
    }
}

/** 将预览数据写入硬盘 */
export async function writePriview(id: number, data: Partial<Preview>) {
    if (data.cover) {
        const cover = coverPath(id);
        await fs.mkdirp(path.dirname(cover));
        await fs.writeFile(cover, data.cover);
    }

    if (data.thumbnails) {
        const preview = previewPath(id);
        await fs.mkdirp(path.dirname(preview));
        await fs.writeFile(preview, data.thumbnails);
    }
}
