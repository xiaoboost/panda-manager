import { Extension } from './types';

import * as fs from '@utils/node/file-system';
import * as utils from '@utils/shared';

/** 模块模板数据 */
export const extensions: Extension[] = [];
/** 模块类型索引 */
const extensionMap = utils.toMap(extensions, ({ name }) => name);

function getBuf(path: string) {
    let buf: Buffer;

    return {
        path,
        buffer: () => buf ? buf : fs.readFile(path).then((data) => (buf = data)),
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

/** 获取所有模块列表 */
export function getAllExtensions() {
    return extensions.slice();
}

/** 项目元数据文件夹 */
export function userDir(name: string) {
    return utils.resolveUserDir(`extension-${name}`);
}

/** 项目临时文件夹 */
export function tempDir(name: string) {
    return utils.resolveTempDir(`extension-${name}`);
}
