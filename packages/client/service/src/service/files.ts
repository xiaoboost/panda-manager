import { Files, Config } from '../model';
import { DeepReadonly } from '@xiao-ai/utils';
import { ItemData, ItemKind, SortBy, warn } from '@panda/shared';
// import { transArr, toBoolMap } from '@panda/utils';

import * as path from 'path';
import * as fs from '@panda/client-utils';

/** 待处理的项目路径 */
const filesQueue: string[] = [];
/** 处理器是否正在运行 */
let isReadingItems = false;

/** 开始处理项目 */
async function startReadItem() {
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
async function readItem(path: string) {
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

  if (fileStat.isDirectory()) {
    // ..
  }
  else {
    // ..
  }
}

/** 新增文件 */
export function push(...inputs: string[]) {
  filesQueue.push(...inputs);
  startReadItem();
}

/** 移除项目 */
export function remove(...inputs: string[]) {
  // const exMap = toBoolMap(transArr(input));
  // Files.where(({ filePath }) => exMap[filePath]).remove();
}

/** 更新项目数据 */
export async function patchItem(data: Partial<ItemData> & { id: number }) {
  if (!data.id) {
    throw new Error('输入数据必须要提供 id');
  }

  await Files.ready;

  const file = Files.limit(1).where((item) => item.id === data.id).toQuery()[0];

  if (!file) {
    throw new Error(`patch 操作 - 未发现编号为 '${data.id}' 的项目`);
  }

  file.set(data);

  return file.data;
}

/** 获取文件详细信息 */
export async function getItemDataById(id: number) {
  await Files.ready;

  const file = Files.limit(1).where((item) => item.id === id).toQuery()[0];

  if (!file) {
    throw new Error(`get 操作 - 未发现编号为 '${id}' 的项目`);
  }

  return file.data;
}

/** 搜索数据库中所有文件 */
export async function search() {
  const { sort } = Config.data;
  const sortBy = {
    [SortBy.name]: 'name',
    [SortBy.size]: 'fileSize',
    [SortBy.lastModified]: 'lastModified',
  } as const;

  return Files
    .orderBy(sortBy[sort.by], sort.asc ? 'asc' : 'desc')
    .toQuery();
}
