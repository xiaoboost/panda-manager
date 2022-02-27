import { DeepReadonly } from '@xiao-ai/utils';
import { ItemData, SortBy, warn } from '@panda/shared';

import { readManga } from './manga';
import { Files, Config } from '../../model';

import * as path from 'path';
import * as fs from '@panda/client-utils';

/** 待处理的项目路径 */
export const filesQueue: string[] = [];
/** 处理器是否正在运行 */
let isReadingItems = false;

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
      }
      else {
        return stat;
      }
    }
    catch (e: any) {
      warn(e.message);
      return;
    }
  }

  /** 数据库中同路径记录 */
  const fileInDb = Files.limit(1).where((item) => item.uri === path).toQuery()[0];

  if (!fileInDb) {
    return;
  }

  /** 文件在硬盘的数据 */
  const fileStat = await readStat(path, fileInDb.data);

  if (!fileStat) {
    return;
  }

  const data = await readManga(path, fileStat);

  if (!data) {
    return;
  }

  // 项目数据添加到数据库
  Files.insert(data);
}
