import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'yaml';

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
    const file = fs.readFileSync(resolve('pnpm-lock.yaml'));
    const lock = yaml.parse(file.toString());
    const packages = Object.keys(lock.packages).map((pack) => {
        const matcher = /\/[^\/]+$/g.exec(pack);

        if (!matcher) {
            return null;
        }

        return pack.substring(1, matcher.index);
    });

    return packages;
})();
