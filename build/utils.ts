import * as path from 'path';
import * as fs from 'fs-extra';

export const isDevelopment = process.argv.includes('--development');
export const isAnalyzer = process.argv.includes('--analyze');
export const modeName = isDevelopment ? 'development' : 'production';

/** 定位到项目根目录 */
export const resolve = (...dir: string[]) => path.join(__dirname, '../', ...dir);

/** 输出路径 */
export const outputDir = resolve('dist/generated');

/** nodejs 内置模块 */
export const builtinModules = [
    'process', 'buffer', 'util', 'sys', 'events', 'stream', 'path',
    'querystring', 'punycode', 'url', 'string_decoder', 'http', 'https',
    'os', 'assert', 'constants', 'timers', 'console', 'vm', 'zlib', 'tty',
    'domain', 'dns', 'dgram', 'child_process', 'cluster', 'module', 'net',
    'readline', 'repl', 'tls', 'crypto', 'fs',
];

/** node_modules 模块 */
export const externalModules = (() => {
    const result: string[] = [];
    const dir = resolve('node_modules');

    fs.readdirSync(dir).forEach((name) => {
        if (name[0] === '@') {
            result.push(...fs.readdirSync(path.resolve(dir, name)).map((inner) => `${name}/${inner}`));
        }
        else {
            result.push(name);
        }
    });

    return result;
})();
