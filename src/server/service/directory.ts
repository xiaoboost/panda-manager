import flatten from 'lodash/flatten';

import { Config } from '../model';
import { filesQueue } from './files-queue';
import { remove, search } from './files';

import { readdirs } from 'src/utils/node/file-system';
import { exclude } from 'src/utils/shared/array';

/** 初始化 */
const ready = (async function init() {
    // 等待初始化
    await Config.ready;

    // 当前数据库中的所有项目
    const filesInDatabase = (await search()).map(({ data }) => data.filePath);
    // 实际存在于硬盘中的文件
    const filesInDisk = flatten(await Promise.all(Config.data.directories.map(readdirs)));

    // 删除数据库中存在，而硬盘中不存在的数据
    remove(exclude(filesInDisk, filesInDatabase));
    // 添加硬盘中存在，而数据库中不存在的数据
    filesQueue.push(...exclude(filesInDatabase, filesInDisk));
})();

export async function update(paths: string[]) {
    // 等待初始化完成
    await ready;

    // 变更配置
    Config.data.directories = paths;

    // // 待处理文件进入队列
    // const files = await readdir(input);
    // filesQueue.push(...files.map((file) => join(input, file)));
}

export async function get() {
    await Config.ready;
    return [...Config.data.directories];
}
