import { VM } from 'vm2';
import { Extension } from './types';
import { extensions } from './utils';
import { Context } from './context';

import { resolveUserDir } from '@utils/shared';

import * as fs from '@utils/node/file-system';

export * from './types';
export { getExtension } from './utils';

/** 扩展的储存路径 */
const extensionPath = resolveUserDir('extensions');

/** 创建项目元数据 */
// export async function createMeta(path: string) {

// }

function readExtension(code: string) {
    /** 模块沙盒 */
    const vm = new VM({
        sandbox: {
            panda: Context,
            modules: {
                exports: {},
            },
        },
    });

    const subModule = vm.run(
        `(function getExtension() {
            ${code};
            return modules.exports;
        })()`,
    );

    return subModule as Extension;
}

export const ready = (async () => {
    // 扩展文件夹不存在
    if (!fs.existsSync(extensionPath)) {
        return fs.mkdirp(extensionPath);
    }

    const files = await fs.readdir(extensionPath);

    for (let i = 0; i < files.length; i++) {
        const content = await fs.readFile(files[i]).catch(() => void 0);

        if (!content) {
            continue;
        }

        const module = readExtension(content.toString());

        extensions.push(module);
    }

    return Promise.resolve();
})();
