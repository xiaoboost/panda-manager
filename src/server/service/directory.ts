import { join } from 'path';

import { getAll } from './object';
import { Config, Database } from '../model';

import { readdir } from 'src/utils/node/file-system';
import { concat, exclude, toBoolMap } from 'src/utils/shared/array';

const { data } = Config;

/** 文件队列是否空闲 */
let loading = false;
/** 待处理的文件队列 */
const filesQueue: string[] = new Proxy([], {
    set(target: string[], prop: string, val) {
        // 普通属性，直接设置属性
        if (prop !== 'length') {
            return Reflect.set(target, prop, val);
        }

        // 设置长度属性的结果
        const result = Reflect.set(target, prop, val);

        // 队列空闲且非空，则启动处理
        if (!loading && target.length > 0) {
            loading = true;

            // (async () => {
            //     while (target.length > 0) {
            //         const meta: any = await createMeta(target.shift()!);

            //         if (meta) {
            //             Objects.insert(meta);
            //         }
            //     }

            //     loading = false;
            // })();
        }

        return result;
    },
});

/** 初始化 */
const ready = (async function init() {
    // 等待初始化
    await Promise.all([Config.ready, Database.ready]);

    // 当前数据库中的所有项目
    const filesInDatabase = getAll().map(({ data }) => data.filePath);
    // 实际存在于硬盘中的文件
    const filesInDisk = concat(
        await Promise.all(Config.data.directories.map(async (dir) => {
            const dirs = await readdir(dir).catch(() => [] as string[]);
            return dirs.map((file) => join(dir, file));
        })),
        (val) => val,
    );

    // 删除数据库中存在，而实际不存在的数据
    const exInDatabase = exclude(filesInDisk, filesInDatabase);

    // if (exInDatabase.length > 0) {
    //     const exMap = toBoolMap(exInDatabase);
    //     Objects.where(({ filePath }) => exMap[filePath]).remove();
    // }

    // 实际存在而数据库中没有的，则要添加
    filesQueue.push(...exclude(filesInDatabase, filesInDisk));
})();

export async function update(paths: string[]) {
    // 等待初始化完成
    await ready;

    // 变更配置
    data.directories = paths;

    // // 待处理文件进入队列
    // const files = await readdir(input);
    // filesQueue.push(...files.map((file) => join(input, file)));
}

export async function get() {
    await Config.ready;
    return [...data.directories];
}
