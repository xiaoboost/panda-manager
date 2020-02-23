import { readFile } from '@utils/node/file-system';
import { uid, Watcher, toMap } from '@utils/shared';

import { Extension, loadExtension } from '@panda/extension-controller';

/** 模块模板数据 */
const extensions = new Watcher<Extension[]>([]);
/** 插件类型 hash */
let extensionMap: Record<string, Extension | undefined> = {};

extensions.observe((data) => {
    extensionMap = toMap(data, ({ name }) => name);
});

/** 初始化读取所有插件 */
export const ready = loadExtension().then((data) => {
    extensions.data = data;
});

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
    for (let i = 0; i < extensions.data.length; i++) {
        const extension = extensions.data[i];

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

/** 添加插件 */
export function add() {
    // ..
}

/** 删除插件 */
export function remove() {
    // ..
}
