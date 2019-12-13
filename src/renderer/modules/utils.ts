import { readFile } from 'fs-extra';

import { warn } from 'renderer/lib/print';
import { toMap } from 'utils/shared';

import { default as Manga } from './manga';

import * as Module from './module';

/** 模块模板数据 */
export const modules: Module.ModuleStatic[] = [Manga];
/** 模块类型索引 */
const modulesMap = toMap(modules, (target) => target.type);

/** 创建文件元数据 */
export async function createMeta(file: string) {
    let buf: Buffer;

    const context: Module.FromContext = {
        file,
        buffer: async () => {
            if (!buf) {
                buf = await readFile(file);
            }

            return buf;
        },
    };

    try {
        // 搜索符合条件的模块
        for (let i = 0; i < modules.length; i++) {
            const meta = await modules[i].from(context);

            if (meta) {
                return meta;
            }
        }
    }
    catch (e) {
        warn(e, true);
        return;
    }
}

/** 由类型获得模块 */
export function getModule(type: Module.ModuleType) {
    return modulesMap[type];
}
