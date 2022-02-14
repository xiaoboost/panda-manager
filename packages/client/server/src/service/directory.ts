import { Config } from '../model';
// import { filesQueue } from './files-queue';
// import { remove, search } from './files';

import { readDirDeep } from '@panda/fs';
// import { exclude } from '@panda/client-utils';

async function _update(paths: string[]) {
  // 更新配置
  Config.set({
    directories: paths,
  });

  // // 当前数据库中的所有项目
  // const filesInDatabase = (await search()).map(({ data }) => data.filePath);
  // // 实际存在于硬盘中的文件
  // const filesInDisk = flatten(await Promise.all(Config.data.directories.map(readdirs)));

  // // 删除数据库中存在，而硬盘中不存在的数据
  // remove(exclude(filesInDisk, filesInDatabase));
  // // 添加硬盘中存在，而数据库中不存在的数据
  // filesQueue.push(...exclude(filesInDatabase, filesInDisk));
}

/** 初始化 */
export const ready = (async function init() {
  // 等待初始化
  await Config.ready;
  // 首次更新
  await _update(Config.data.directories as string[]);
})();

/** 更新文件夹列表 */
export async function update(paths: string[]) {
  await ready;
  await _update(paths);
}

/** 获取文件夹列表 */
export async function get() {
  await ready;
  return [...Config.data.directories];
}
