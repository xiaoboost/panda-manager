/* eslint-disable @typescript-eslint/no-var-requires */

import Chalk from 'chalk';
import Webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { join } from 'path';
import { removeSync as rm, readdirSync, statSync } from 'fs-extra';

/** 定位到项目根目录 */
export const resolveRoot = (...dir: string[]) => join(__dirname, '../', ...dir);

/** 生成项目路径定位函数 */
export const resolvePackage = (name: string) => (...dir: string[]) => resolveRoot('packages', name, ...dir);

/** 当前编译时间 */
export const buildTag = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
})();

/** webpack 外部模块 */
function webpackExternals(): Record<string, string> {
    const nodeModules = [
        'process', 'buffer', 'util', 'sys', 'events', 'stream', 'path',
        'querystring', 'punycode', 'url', 'string_decoder', 'http', 'https',
        'os', 'assert', 'constants', 'timers', 'console', 'vm', 'zlib', 'tty',
        'domain', 'dns', 'dgram', 'child_process', 'cluster', 'module', 'net',
        'readline', 'repl', 'tls', 'crypto', 'fs',
    ];

    const externalModules = [
        'electron', 'vm2',
    ];

    return nodeModules.concat(externalModules).reduce((map, name) => {
        map[name] = `commonjs ${name}`;
        return map;
    }, {});
}

/** webpack 别名 */
function webpackAlias() {
    const packages = readdirSync(resolveRoot('packages'))
        .filter((name) => name !== 'utils')
        .map((name) => ({
            name,
            path: resolveRoot(`packages/${name}/src`),
        }))
        .reduce((map, { name, path }) => {
            map[name] = path;
            return map;
        }, {});

    return {
        '@utils': resolveRoot('packages/utils/src'),
        ...packages,
    };
}

/** 检查编译项目是否存在 */
function checkProjectName(name: string) {
    const paths = readdirSync(resolveRoot('packages'));
    const isExist = paths.includes(name);

    if (!isExist) {
        return false;
    }

    const stat = statSync(resolveRoot('packages', name));
    return stat.isDirectory();
}

/** 设置 webpack 的公共属性 */
function webpackCommon(config: Webpack.Configuration) {
    if (!config.resolve) {
        config.resolve = {};
    }

    if (!config.resolve.alias) {
        config.resolve.alias = {};
    }

    config.resolve.alias = {
        ...config.resolve.alias,
        ...webpackAlias(),
    };

    if (!config.optimization) {
        config.optimization = {};
    }

    if (!config.optimization.minimizer) {
        config.optimization.minimizer = [];
    }

    if (!config.plugins) {
        config.plugins = [];
    }

    config.plugins = config.plugins.concat([
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        new ProgressBarPlugin({
            width: 40,
            format: `${Chalk.green('> building:')} [:bar] ${Chalk.green(':percent')} (:elapsed seconds)`,
        }),
    ]);

    config.externals = {
        ...(config.externals as object || {}),
        ...webpackExternals(),
    };
}

/** 调试模式 */
export function devBuild(name: string) {
    if (!checkProjectName(name)) {
        console.error(`Project '${name}' is not exist!`);
        process.exit(1);
    }

    const BaseConfig: Webpack.Configuration = require(resolveRoot('packages', name, 'webpack.ts')).webpackConfig;

    if (!BaseConfig.mode) {
        BaseConfig.mode = 'development';
    }

    // 删除输出文件夹
    rm(BaseConfig.output!.path!);

    webpackCommon(BaseConfig);

    // 每个模块用 eval() 执行, SourceMap 作为 DataUrl 添加到文件末尾
    if (!BaseConfig.devtool) {
        BaseConfig.devtool = 'eval-source-map';
    }

    BaseConfig.optimization!.namedChunks = true;
    BaseConfig.optimization!.namedModules = true;
    BaseConfig.optimization!.noEmitOnErrors = true;

    // 调试用的插件
    BaseConfig.plugins = BaseConfig.plugins!.concat([
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"',
        }),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Project '${name}' compile done.`],
                notes: [],
            },
        }),
    ]);

    const compiler = Webpack(BaseConfig);

    compiler.watch(
        { ignored: /node_modules/ },
        (err?: Error) => (
            (err && console.error(err.stack || err)) ||
            (err && (err as any).details && console.error((err as any).details))
        ),
    );
}

/** 编译模式 */
export function build(name: string) {
    if (!checkProjectName(name)) {
        console.error(`Project '${name}' is not exist!`);
        process.exit(1);
    }

    const BaseConfig: Webpack.Configuration = require(resolveRoot('packages', name, 'webpack.ts')).webpackConfig;

    if (!BaseConfig.mode) {
        BaseConfig.mode = 'production';
    }

    // 删除输出文件夹
    rm(BaseConfig.output!.path!);

    webpackCommon(BaseConfig);

    BaseConfig.optimization!.minimize = true;

    BaseConfig.optimization!.minimizer = BaseConfig.optimization!.minimizer!.concat([
        new TerserPlugin({
            test: /\.js$/i,
            cache: false,
            terserOptions: {
                ecma: 7,
                ie8: false,
                safari10: false,
                output: {
                    comments: /^!/,
                },
                compress: {
                    negate_iife: false,
                },
            },
        }),
    ]);

    BaseConfig.plugins = BaseConfig.plugins!.concat([
        new OptimizeCSSPlugin(),
        new BundleAnalyzerPlugin({
            analyzerPort: 9876,
        }),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
    ]);

    Webpack(BaseConfig, (err, stats) => {
        if (err) {
            throw err;
        }

        console.log(stats.toString({
            chunks: false,
            chunkModules: false,
            chunkOrigins: false,
            colors: true,
            modules: false,
            children: false,
        }));
    });
}
