import { DeepReadonly } from '@xiao-ai/utils';
import { ItemData, warn } from '@panda/shared';
import { Manga } from '@panda/plugin-manga/client';

import { Files } from '../../model';

import * as fs from '@panda/client-utils';

/** 处理器是否正在运行 */
let isReadingItems = false;
/** 待处理的项目路径 */
export const filesQueue: string[] = [];

/** 开始处理项目 */
export async function startReadItem() {
  if (isReadingItems) {
    return;
  }

  isReadingItems = true;

  while (filesQueue.length > 0) {
    await readItem(filesQueue.pop()!);
  }

  isReadingItems = false;
}

/** 处理文件 */
export async function readItem(path: string) {
  async function readStat(filePath: string, data: DeepReadonly<ItemData>) {
    try {
      const stat = await fs.stat(filePath);

      // 文件系统中最后修改时间与数据库中记录一致，则跳过
      if (stat.mtimeMs === data.lastModified) {
        return;
      } else {
        return stat;
      }
    } catch (e: any) {
      warn(e.message);
      return;
    }
  }

  /** 数据库中同路径记录 */
  const fileInDb = Files.limit(1)
    .where((item) => item.uri === path)
    .toQuery()[0];

  if (!fileInDb) {
    return;
  }

  /** 文件在硬盘的数据 */
  const fileStat = await readStat(path, fileInDb.data);

  if (!fileStat) {
    return;
  }

  const itemData = await Manga.createByPath(path, fileStat);

  if (!itemData) {
    return;
  }

  // 项目数据添加到数据库
  const insertedData = Files.insert(itemData[0])[0];

  if (!insertedData) {
    return;
  }

  await Manga.writeCacheToDisk?.(insertedData.data as MangaData, itemData[1]);
}
