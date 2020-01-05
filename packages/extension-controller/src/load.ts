import { join } from 'path';
import { VM, VMScript } from 'vm2';
import { uid, resolveRoot } from '@utils/shared';
import { readFile, readJSON, readdir } from '@utils/node/file-system';
// import { Extension as MangaExtension } from '@panda/extension-manga';

import { Context } from './context';
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

async function loadExtension(name: string) {
    const data = await readJSON<PackageInfo>(join(extensionPath, name, 'manifest.json'));

    if (!data || !data.main) {
        return;
    }

    const scriptPath = join(extensionPath, name, data.main);
    const scriptFile = await readFile(scriptPath);

    if (!scriptFile) {
        return;
    }

    const script = new VMScript(scriptFile.toString(), scriptPath);
    const vm = new VM({
        sandbox: Context(data.name),
        eval: false,
    });

    const result = vm.run(script);
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
