import { join } from 'path';
import { VM, VMScript } from 'vm2';
import { uid, resolveRoot, _eval } from '@utils/shared';
import { readFile, readJSON, readdir } from '@utils/node/file-system';

import { Context } from './context';
import { Extension } from './types';
import { extensions } from './utils';

interface PackageInfo {
    main: string;
    name: string;
    version: string;
}

function getBuf(path: string) {
    let buf: Buffer;

    return {
        path,
        buffer: () => buf ? buf : readFile(path).then((data) => (buf = data)),
    };
}

const extensionPath = resolveRoot('extensions');

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

async function loadExtension(name: string): Promise<Extension | undefined> {
    const data = await readJSON<PackageInfo>(join(extensionPath, name, 'manifest.json'));

    if (!data || !data.main) {
        return;
    }

    const scriptPath = join(extensionPath, name, data.main);
    let scriptFile = (await readFile(scriptPath).catch(() => '')).toString().trim();

    if (!scriptFile) {
        return;
    }

    // 取消顶级作用域中的函数表达式
    if (scriptFile.indexOf('!function') === 0) {
        scriptFile = `(${scriptFile.slice(1)})`;
    }

    let result;
    const context = Context(data.name);

    if (process.env.NODE_ENV === 'development') {
        const globalKeys = Object.keys(context).map((key) => {
            return `const ${key} = self.${key};`;
        });

        /* eslint-disable @typescript-eslint/no-unused-vars */
        result = (function(self: typeof context) {
            return _eval(`
                ${globalKeys.join('\n')}\n
                ${scriptFile};
            `);
        })(context);
    }
    else {
        const script = new VMScript(scriptFile, scriptPath);
        const vm = new VM({
            sandbox: context,
            eval: false,
        });

        result = vm.run(script);
    }

    return result.default ? result.default : result;
}

export const ready = (async () => {
    const pluginDirs = await readdir(extensionPath);

    await Promise.all(pluginDirs.map(async (name) => {
        const ex = await loadExtension(name);

        if (ex) {
            extensions.push(ex);
        }
    }));

    if (process.env.NODE_ENV === 'development') {
        console.log(extensions);
    }
})();
