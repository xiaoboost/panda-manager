import path from 'path';

import { Config } from '../../model';
import { remove, search, push } from '../files';

import { exclude } from '@xiao-ai/utils';
import { readdir } from '@panda/client-utils';

async function update(paths: string[]) {
  // 更新配置
  Config.set({ directories: paths });

  // 当前数据库中的所有项目
  const filesInDatabase = (await search()).map(({ data }) => data.uri);
  // 读取所有文件夹
  const filesInDirs = await Promise.all(
    Config.data.directories.map((item) =>
      readdir(item).then((arr) => arr.map((name) => path.join(item, name))),
    ),
  );
  // 硬盘中的所有项目
  const filesInDisk = filesInDirs.reduce((ans, item) => ans.concat(item), []);
  // 数据库中存在，而硬盘中不存在的数据
  const onlyInDb = exclude(filesInDisk, filesInDatabase);
  // 硬盘中存在，而数据库中不存在的数据
  const onlyInDisk = exclude(filesInDatabase, filesInDisk);

  remove(...onlyInDb);
  push(...onlyInDisk);
}

/** 初始化 */
export const ready = (async function init() {
  await Config.ready;
  await update(Config.data.directories as string[]);
})();

/** 更新文件夹列表 */
export async function patch(paths: string[]) {
  await ready;
  await update(paths);
}

/** 获取文件夹列表 */
export async function get() {
  await ready;
  return [...Config.data.directories];
}
