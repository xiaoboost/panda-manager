import Chalk from 'chalk';
import Webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import * as path from 'path';
import * as fs from 'fs-extra';

const isDevelopment = process.env.NODE_ENV === 'development';
const modeName = isDevelopment ? 'development' : 'production';

/** 定位到项目根目录 */
export const resolve = (...dir: string[]) => path.join(__dirname, '../', ...dir);

/** 当前编译时间 */
export const buildTag = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
})();

/** nodejs 内置模块 */
const builtinModules = [
    'process', 'buffer', 'util', 'sys', 'events', 'stream', 'path',
    'querystring', 'punycode', 'url', 'string_decoder', 'http', 'https',
    'os', 'assert', 'constants', 'timers', 'console', 'vm', 'zlib', 'tty',
    'domain', 'dns', 'dgram', 'child_process', 'cluster', 'module', 'net',
    'readline', 'repl', 'tls', 'crypto', 'fs',
];

const externalModules = (() => {
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

/** 公共配置 */
const webpackCommonConfig: Webpack.Configuration = {
    target: 'electron-main',
    externals: builtinModules,
    mode: modeName,
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: {
        client: resolve('src/main/index.ts'),
        renderer: resolve('src/renderer/init/index.ts'),
    },
    output: {
        path: resolve('dist/generated'),
        filename: 'scripts/[name].js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.less', '.css'],
        mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.less', 'index.css'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: resolve('tsconfig.json'),
            }),
        ],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 2048000,
        maxAssetSize: 2048000,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: resolve('tsconfig.json'),
                },
            },
            {
                test: /\.css$/,
                use: ['css-loader'],
            },
            {
                test: /\.styl$/,
                include: /node_modules/,
                use: ['css-loader', 'stylus-loader'],
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            localsConvention: 'camelCaseOnly',
                            modules: {
                                context: resolve('src'),
                                localIdentName: isDevelopment
                                    ? '[local]__[hash:base64:5]'
                                    : '[hash:base64:6]',
                            },
                        },
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            javascriptEnabled: true,
                            paths: [resolve('src')],
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        splitChunks: {
            maxInitialRequests: Infinity,
            minSize: 0,
            minChunks: 1,
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'common',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
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
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(modeName),
        }),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: ['Project compile done.'],
                notes: [],
            },
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('src/renderer/index.html'),
            inject: true,
            excludeChunks: [],
            minify: {
                removeComments: !isDevelopment,
                collapseWhitespace: !isDevelopment,
                ignoreCustomComments: [/^-/],
            },
        }),
    ],
};

if (isDevelopment) {
    webpackCommonConfig.devtool = 'source-map';
    webpackCommonConfig.externals = builtinModules.concat(externalModules);
    webpackCommonConfig.plugins = (webpackCommonConfig.plugins || []).concat([
        new MiniCssExtractPlugin({
            filename: 'styles/renderer.css',
        }),
    ]);
}

if (!isDevelopment) {
    if (!webpackCommonConfig.optimization) {
        webpackCommonConfig.optimization = {};
    }

    webpackCommonConfig.optimization.minimize = true;
    webpackCommonConfig.optimization.minimizer = [
        new TerserPlugin({
            test: /\.js$/i,
            cache: false,
            terserOptions: {
                ecma: 8,
                ie8: false,
                safari10: false,
                output: {
                    comments: /^!/,
                },
            },
        }),
    ];

    webpackCommonConfig.plugins = (webpackCommonConfig.plugins || []).concat([
        new OptimizeCSSPlugin(),
        new BundleAnalyzerPlugin({
            analyzerPort: 9876,
        }),
    ]);
}

/** 调试模式 */
async function devBuild() {
    const compiler = Webpack(webpackCommonConfig);

    compiler.watch({ ignored: /node_modules/ }, (err?: Error) => {
        if (err) {
            console.error(err.stack || err);
        }
    });
}

/** 编译模式 */
async function build() {
    Webpack(webpackCommonConfig, (err, stats) => {
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

if (isDevelopment) {
    devBuild();
}
else {
    build();
}
