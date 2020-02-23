import { join } from 'path';
import { VM, VMScript } from 'vm2';
import { resolveRoot, resolveUserDir } from '@utils/node/env';
import { readdir, readFile, readJSON, exists, mkdirp } from '@utils/node/file-system';

import { Context } from './context';
import { PackageInfo, Extension } from './types';

export * from './types';

const extensionPath = process.env.NODE_ENV === 'development'
    ? resolveRoot('extensions')
    : resolveUserDir('extensions');

/** 读取单个插件 */
export async function loadExtensionByName(name: string): Promise<Extension | undefined> {
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
        result = (function(_window: typeof context) {
            /* eslint-disable no-eval */
            return eval(`
                const self = _window;
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

/** 读取所有插件 */
export async function loadExtension(): Promise<Extension[]> {
    if (!await exists(extensionPath)) {
        await mkdirp(extensionPath);
    }

    const extensions: Extension[] = [];
    const pluginDirs = await readdir(extensionPath);

    await Promise.all(pluginDirs.map(async (name) => {
        const data = await loadExtensionByName(name);

        if (data) {
            extensions.push(data);
        }
    }));

    if (process.env.NODE_ENV === 'development') {
        console.log(extensions);
    }

    return extensions;
}
