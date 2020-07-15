import naturalCompare from 'string-natural-compare';

import { zipFiles } from 'src/utils/node/zip';
import { isDef } from 'src/utils/shared/assert';
import { resolveRoot } from 'src/utils/node/env';
import { WorkerPool } from 'src/utils/node/works-pool';
import { isImage, imageSize } from 'src/utils/node/image';

import { cover, preview } from '../utils/path';

import * as path from 'path';
import * as fs from 'src/utils/node/file-system';

const imageWorker = new WorkerPool(resolveRoot('scripts/image.js'), {
    max: 1,
});

/** 预览数据 */
interface Preview {
    cover: Buffer;
    thumbnail: Buffer;
    sizes: (readonly [number, number])[];
}

/** 封面图片参数 */
const CoverCompress = {
    type: 'jpg',
    quality: 90,
    height: 400,
};

/** 预览图片参数 */
const PriviewCompress = {
    type: 'jpg',
    quality: 80,
    width: 100,
    height: 142,
};

/** 有效图片数量 */
const leastNumber = 3;

async function compositeImage(images: Buffer[]) {
    let imgs = images;

    while (imgs.length > 1) {
        const len = imgs.length;

        let index = 0;

        // 当前元素和下一个元素都存在
        if (index < len && index + 1 < len) {
            await imageWorker.send('extend', imgs[index], imgs[index + 1]);
            index += 2;
        }
        else {
            const result = await imageWorker.getResult<Buffer>();

            if (index === len) {
                result.push(imgs[len - 1]);
            }

            imgs = result;
        }
    }

    return imgs[0];
}

async function fromDir(dir: string): Promise<Preview | undefined> {
    /** 封面图片数据 */
    const cover = Buffer.from('');
    /** 预览图片数据 */
    const thumbnail = Buffer.from('');
    /** 预览图片的位置信息 */
    const sizes: [number, number][] = [];
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

        // // 生成预览图片
        // const preview = await compress(image, {
        //     type: 'jpg',
        //     ...PriviewCompress,
        // });

        // // 第一页
        // if (i === 0) {
        //     // 预览图片
        //     thumbnails = preview;
        //     // 压缩首页
        //     cover = await compress(image, {
        //         type: 'jpg',
        //         ...CoverCompress,
        //     });
        // }
        // else {
        //     thumbnails = await concat(thumbnails, preview);
        // }

        // // 记录当前图片在预览总图中右下角的坐标
        // position.push([
        //     imageSize(thumbnails)!.width,
        //     imageSize(preview)!.height,
        // ]);
    }

    // 如果少于 3 张图片，则跳过
    if (sizes.length <= leastNumber) {
        return;
    }

    return {
        cover,
        thumbnail,
        sizes,
    };
}

async function fromZip(zip: string | Buffer): Promise<Preview | undefined> {
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

        // 生成封面
        if (index === 0) {
            await imageWorker.send('compress', image, CoverCompress);
        }

        // 生成预览图片
        await imageWorker.send('compress', image, PriviewCompress);
    }

    // 如果少于 3 张图片，则跳过
    if (position.length <= leastNumber + 1) {
        return;
    }

    const compressed = await imageWorker.getResult<Buffer>();
    const thumbnails = compressed.slice(1);
    const sizes = thumbnails
        .map((img) => imageSize(img))
        .filter(isDef)
        .map(({ width, height }) => [width, height] as const);

    return {
        sizes,
        cover: compressed[0],
        thumbnail: await compositeImage(thumbnails),
    };
}

/** 生成预览数据 */
export async function buildPreview(file: string) {
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
        const coverPath = cover(id);
        await fs.mkdirp(path.dirname(coverPath));
        await fs.writeFile(coverPath, data.cover);
    }

    if (data.thumbnail) {
        const previewPath = preview(id);
        await fs.mkdirp(path.dirname(previewPath));
        await fs.writeFile(previewPath, data.thumbnail);
    }
}
