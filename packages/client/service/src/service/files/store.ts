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
  /** 数据库中同路径记录 */
  const fileInDb = Files.limit(1)
    .where((item) => item.uri === path)
    .toQuery()[0];

  if (!fileInDb) {
    return;
  }

  /** 文件在硬盘的数据 */
  const fileStat = await fs.stat(path).catch(() => void 0);

  if (!fileStat) {
    return;
  }

  // 文件系统中最后修改时间与数据库中记录一致，则跳过
  if (fileStat.mtimeMs === fileInDb.data.lastModified) {
    return;
  }

  const manga = await Manga.createByPath(path, fileStat);

  if (!manga) {
    return;
  }

  // 项目数据添加到数据库
  const insertedData = Files.insert(manga.data)[0];

  if (!insertedData) {
    return;
  }

  await manga?.writeCache();
}
