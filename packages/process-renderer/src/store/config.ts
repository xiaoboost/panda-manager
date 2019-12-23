import { readFile, writeFile } from 'fs-extra';

import { gzip, gunzip } from '@utils/node';
import { Watcher, debounce, resolveUserDir } from '@utils/shared';

/** 配置文件路径 */
const configPath = resolveUserDir('config');

/** 排序方式 */
export const enum SortBy {
    name,
    lastModified,
    size,
}

/** 排序选项 */
export interface SortOption {
    by: SortBy;
    asc: boolean;
}

/** 参数选项 */
export interface ConfigData {
    sort: SortOption;
    directories: string[];
}

/** 初始化默认值 */
const ininVal: ConfigData = {
    directories: [],
    sort: {
        by: SortBy.name,
        asc: true,
    },
};

/** 配置选项监听器 */
export const data = new Watcher<ConfigData>(ininVal);

/** 配置文件写入硬盘 */
const writeDisk = debounce(200, async (val: ConfigData) => {
    await writeFile(configPath, await gzip(JSON.stringify(val)));
});

/** 配置选项初始化完成 */
export const ready = (async () => {
    try {
        const buf = await gunzip(await readFile(configPath));
        data.data = JSON.parse(buf.toString());
    }
    catch (err) {
        console.info('配置文件初始化出错，使用默认值覆盖');
        writeDisk(ininVal);
    }
})();

// 每次变更都写配置文件至硬盘
data.observe(writeDisk);
