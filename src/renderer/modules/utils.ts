import { readFile, stat } from 'fs-extra';

import { warn } from 'renderer/lib/print';

import * as Module from './module';
import * as Manga from './manga';

import * as utils from 'utils/shared';

/** 模块模板数据 */
export const modules: Module.Module[] = [Manga];
/** 模块类型索引 */
const modulesMap = utils.toMap(modules, (target) => target.type);

function getBuf(path: string) {
    let buf: Buffer;

    return {
        path,
        buffer: () => buf ? buf : readFile(path).then((data) => (buf = data)),
    };
}

/** 创建文件元数据 */
export async function createMeta(file: string) {
    // 文件上下文
    const context = {
        id: utils.uid(),
        ...getBuf(file),
    };

    // 搜索符合条件的模块
    for (let i = 0; i < modules.length; i++) {
        try {
            const meta = await modules[i].from(context);

            if (meta) {
                return meta;
            }
        }
        catch (e) {
            warn(e, true);
            continue;
        }
    }
}

/** 由类型获得模块 */
export function getModule(type: Module.ModuleType) {
    return modulesMap[type];
}

/** 项目元数据文件夹 */
export function metaDir(id: number) {
    return utils.resolveUserDir('metas', id);
}

/** 项目临时文件夹 */
export function tempDir(id: number) {
    return utils.resolveTempDir('metas', id);
}
