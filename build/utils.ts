import Webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import { loader } from 'mini-css-extract-plugin';
import { removeSync as rm, readdirSync, statSync } from 'fs-extra';

import { resolveRoot } from './env';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Generate tag of build
 * @returns {string}
 */
function buildTag() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
}

/** 当前版本号 */
export const version = buildTag();

/** 生成 css loader */
export const cssLoader = (): Webpack.RuleSetUseItem[] => [
    process.env.NODE_ENV === 'development' ? 'style-loader' : loader,
    {
        loader: 'css-loader',
        options: {
            localsConvention: 'camelCaseOnly',
            modules: {
                localIdentName: '[local]__[hash:base64:5]',
                context: resolveRoot(__dirname, 'src'),
            },
        },
    },
];

/** 生成 webpack 基础配置 */
export function webpackBaseConfig(mode: 'main' | 'renderer'): Webpack.Configuration {
    return {
        mode: process.env.NODE_ENV as Webpack.Configuration['mode'],
        target: `electron-${mode}` as Webpack.Configuration['target'],
        node: {
            __dirname: false,
            __filename: false,
        },
        externals: {
            'fs-extra': 'commonjs fs-extra',
        },
        optimization: {
            minimizer: [],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.styl', '.less', '.css'],
            mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.styl', 'index.less', 'index.css'],
            alias: {
                src: resolveRoot('src'),
                main: resolveRoot('src/main'),
                renderer: resolveRoot('src/renderer'),
                utils: resolveRoot('src/utils/shared'),
            },
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: resolveRoot(`tsconfig.build.${mode}.json`),
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                    options: {
                        configFile: resolveRoot(`tsconfig.build.${mode}.json`),
                    },
                },
                {
                    test: /\.node$/,
                    use: 'node-loader',
                },
                {
                    test: /\.css$/,
                    use: cssLoader(),
                },
                {
                    test: /\.less$/,
                    use: cssLoader().concat([
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                                paths: [
                                    resolveRoot('node_modules'),
                                    resolveRoot('src'),
                                ],
                            },
                        },
                    ]),
                },
            ],
        },
        plugins: [
            new Webpack.optimize.ModuleConcatenationPlugin(),
            new Webpack.HashedModuleIdsPlugin({
                hashFunction: 'sha256',
                hashDigest: 'hex',
                hashDigestLength: 6,
            }),
            new Webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevelopment ? '"development"' : '"production"',
            }),
        ],
    };
}

/** 调试模式 */
export function devBuild(BaseConfig: Webpack.Configuration, message: string) {
    // 删除输出文件夹
    rm(BaseConfig.output!.path!);

    // 每个模块用 eval() 执行, SourceMap 作为 DataUrl 添加到文件末尾
    BaseConfig.devtool = 'eval-source-map';

    // 调试用的插件
    BaseConfig.plugins!.push(
        new Webpack.NamedModulesPlugin(),
        new Webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [message],
                notes: [],
            },
        }),
    );

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
export function build(BaseConfig: Webpack.Configuration) {
    // 删除输出文件夹
    rm(BaseConfig.output!.path!);

    BaseConfig.optimization!.minimizer!.push(
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
            },
        }),
    );

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

/** 检查编译项目是否存在 */
export function checkProjectName(name: string) {
    const paths = readdirSync(resolveRoot('src'));
    const isExist = paths.includes(name);

    if (!isExist) {
        return false;
    }

    const stat = statSync(resolveRoot('src', name));

    return stat.isDirectory();
}
