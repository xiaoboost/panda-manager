import { readFile } from 'fs-extra';
import { Extension } from './types';

import * as utils from '@utils/shared';

/** 模块模板数据 */
export const extensions: Extension[] = [];
/** 模块类型索引 */
const extensionMap = utils.toMap(extensions, ({ name }) => name);

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
    for (let i = 0; i < extensions.length; i++) {
        const extension = extensions[i];

        if (!extension.from) {
            continue;
        }

        try {
            const meta = await extension.from(context);

            if (meta) {
                return meta;
            }
        }
        catch (e) {
            console.warn(e, true);
            continue;
        }
    }
}

/** 由类型获得模块 */
export function getExtension(name: string) {
    return extensionMap[name];
}

/** 项目元数据文件夹 */
export function userDir(id: number) {
    return utils.resolveUserDir('metas', id);
}

/** 项目临时文件夹 */
export function tempDir(id: number) {
    return utils.resolveTempDir('metas', id);
}
