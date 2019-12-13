import * as fs from 'fs-extra';
import * as path from 'path';

import Zip from 'renderer/lib/zip';
import naturalCompare from 'string-natural-compare';

import { imageSize } from 'image-size';
import { readdirs } from 'utils/node';
import { isString } from 'utils/shared';
import { compress, concat } from 'renderer/lib/image';

/** 预览数据 */
interface Preview {
    cover: Buffer;
    thumbnails: Buffer;
    position: [number, number][];
}

/** 封面图片参数 */
const CoverCompress = {
    quality: 95,
    size: {
        height: 400,
    },
};

/** 预览图片参数 */
const PriviewCompress = {
    quality: 80,
    size: {
        maxWidth: 220,
    },
};

/** 允许的图片后缀 */
const allowImageExt = ['.png', '.jpg', '.jepg', '.bmp'];

async function fromDir(dir: string): Promise<Preview> {
    /** 封面图片数据 */
    let cover = Buffer.from('');
    /** 预览图片数据 */
    let thumbnails = Buffer.from('');
    /** 预览图片的位置信息 */
    const position: [number, number][] = [];
    /** 文件夹内所有文件 */
    const allFiles = (await readdirs(dir)).sort(naturalCompare);

    for (let i = 0; i < allFiles.length; i++) {
        const file = allFiles[i];

        // 跳过不允许的文件后缀
        if (!allowImageExt.includes(path.extname(file).toLowerCase())) {
            continue;
        }

        // 当前图片
        const image = await fs.readFile(file);
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

    return {
        cover,
        thumbnails,
        position,
    };
}

async function fromZip(file: string | Buffer): Promise<Preview> {
    const zip = await Zip.fromFile(file);
    return {} as any;
}

/** 生成预览数据 */
export default async function create(file: string | Buffer) {
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
