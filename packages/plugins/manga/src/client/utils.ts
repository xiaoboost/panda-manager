import { naturalCompare } from '@panda/shared';

import { zipFiles } from '@panda/zip';
import { isImage, compress, CompressOption } from '@panda/image';

import * as fs from '@panda/client-utils';

/** 封面图片参数 */
const CoverCompress: CompressOption = {
  type: 'jpg',
  quality: 90,
  height: 400,
};

/** 有效图片数量 */
const leastNumber = 3;

async function fromDir(dir: string): Promise<Buffer | undefined> {
  /** 文件夹内所有文件 */
  const allFiles = (await fs.readDirDeep(dir)).sort(naturalCompare);
  /** 图片计数器 */
  let count = 0;
  /** 封面图片 */
  let cover: Buffer | undefined;

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];

    // 当前图片
    const image = await fs.readFile(file);

    if (isImage(image)) {
      // 制作封面
      if (count === 0) {
        cover = await compress(image, CoverCompress);
      }

      count++;

      if (count >= leastNumber) {
        break;
      }
    }
  }

  if (cover && count >= leastNumber) {
    return cover;
  }
}

async function fromZip(zip: string | Buffer): Promise<Buffer | undefined> {
  /** 图片计数器 */
  let count = 0;
  /** 封面图片 */
  let cover: Buffer | undefined;

  // 迭代压缩包内的数据
  for await (const { buffer: image } of zipFiles(zip, naturalCompare)) {
    if (isImage(image)) {
      // 制作封面
      if (count === 0) {
        cover = await compress(image, CoverCompress);
      }

      count++;

      if (count >= leastNumber) {
        break;
      }
    }
  }

  if (cover && count >= leastNumber) {
    return cover;
  }
}

/** 生成预览数据 */
export function getCover(filePath: string, stat: fs.Stats) {
  if (stat.isDirectory()) {
    return fromDir(filePath);
  }
  else {
    return fromZip(filePath);
  }
}
