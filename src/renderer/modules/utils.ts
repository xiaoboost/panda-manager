import { readFile } from 'fs-extra';

import { warn } from 'renderer/lib/print';

import * as Module from './module';
import * as Manga from './manga';

import {
    toMap,
    uid,
    resolveUserDir,
    resolveTempDir,
} from 'utils/shared';

/** 模块模板数据 */
export const modules: Module.Module[] = [Manga];
/** 模块类型索引 */
const modulesMap = toMap(modules, (target) => target.type);

/** 创建文件元数据 */
export async function createMeta(file: string) {
    let buf: Buffer;

    const context: Module.FromContext = {
        file,
        id: uid(),
        buffer: () => buf ? buf : readFile(file).then((data) => (buf = data)),
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

/** 项目元数据文件夹 */
export function metaDir(id: number) {
    return resolveUserDir('metas', id);
}

/** 项目临时文件夹 */
export function tempDir(id: number) {
    return resolveTempDir('metas', id);
}
