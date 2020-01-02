import { extensions } from './utils';

import { uid } from '@utils/shared';
import { readFile } from '@utils/node';
// import { Extension as MangaExtension } from '@panda/extension-manga';

function getBuf(path: string) {
    let buf: Buffer;

    return {
        path,
        buffer: () => buf ? buf : readFile(path).then((data) => (buf = data)),
    };
}

/** 创建项目元数据 */
export async function createMeta(file: string) {
    // 文件上下文
    const context = {
        id: uid(),
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

export const ready = (async () => {
    // extensions.push(MangaExtension);
})();
