import { Files, Config } from '../../model';
import { DeepReadonly } from '@xiao-ai/utils';
import { ItemData, ItemKind, SortBy, warn } from '@panda/shared';
// import { transArr, toBoolMap } from '@panda/utils';

import { filesQueue, startReadItem } from './store';

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
