import * as fs from 'fs-extra';
import * as path from 'path';

import { remote } from 'electron';

import { loading } from './state';
import { ready as ConfigReadt, Config } from './config';
import { ready as DatabaseReady, Objects } from './database';

import { createMeta } from 'renderer/modules';
import { handleError } from 'renderer/lib/print';

import { concat, toMap, exclude } from 'utils/shared';

/** 待处理的文件列表 */
const files: string[] = new Proxy([], {
    set(target, prop, val) {
        if (prop !== 'length') {
            return Reflect.set(target, prop, val);
        }

        target.length = val;
    },
});

/** 初始化 */
export const ready = (async function init() {
    // 等待初始化
    await Promise.all([ConfigReadt, DatabaseReady]);

    // 当前数据库中的所有项目
    const filesInDatabase = Objects.toQuery().map(({ data }) => data.file);
    // 实际存在于硬盘中的文件
    const filesInDisk = concat(
        await Promise.all(Config.data.directories.map((dir) => fs.readdir(dir).catch(() => [] as string[]))),
        (val) => val,
    );

    // 删除数据库中存在，而实际不存在的数据
    const exInDatabase = toMap(exclude(filesInDatabase, filesInDisk));
    Objects.where(({ file }) => exInDatabase[file]).remove();

    // 实际存在而数据库中没有的，则要添加
    files.push(...exclude(filesInDisk, filesInDatabase));
})();

/** 添加仓库文件夹 */
export async function add(input: string) {
    if (Config.data.directories.includes(input)) {
        handleError(handleError.messages.noRepeatFolder);
        return;
    }

    // 等待初始化完成
    await ready;

    // 变更配置
    Config.data = {
        ...Config.data,
        directories: Config.data.directories.concat([input]),
    };

    // 待处理的文件列表
    const dirs = await fs.readdir(input);
}

/** 移除仓库文件夹 */
export async function remove(input: string) {
    // 当前文件夹列表不包含输入路径，直接退出
    if (!Config.data.directories.includes(input)) {
        return;
    }

    // 等待初始化完成
    await ready;
}
