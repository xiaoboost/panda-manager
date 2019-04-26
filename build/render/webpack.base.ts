import Chalk from 'Chalk';

import Webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { version, cssLoader } from '../utils';
import { resolveRoot, render } from '../env';

const { assert, output, resolve, publicPath } = render;

const isDevelopment = process.env.NODE_ENV === 'development';

// 清空屏幕
console.log('\x1Bc');
console.log(Chalk.yellow('> Start Compile:\n'));

type WebpackConfig = GetArrayItem<Parameters<typeof Webpack>[0]>;

const baseConfig: WebpackConfig = {
    mode: process.env.NODE_ENV as WebpackConfig['mode'],
    entry: resolve('main.tsx'),
    target: 'electron-renderer',
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        path: output,
        publicPath,
        filename: '[name].js',
    },
    resolve: {
        // 自动补全的扩展名
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.styl', '.less', '.css'],
        // 目录下的默认主文件
        mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.less', 'index.css'],
        // 默认路径别名
        alias: {
            'src': resolve('src/render'),
            'object-assign': resolveRoot('node_modules/object-assign/index.js'),
        },
        plugins: [
            new TsconfigPathsPlugin({
                configFile: resolveRoot('tsconfig.build.render.json'),
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
                    configFile: resolveRoot('tsconfig.build.render.json'),
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
                test: /\.styl(us)?$/,
                use: cssLoader().concat(['stylus-loader']),
            },
            {
                test: /\.less$/,
                use: cssLoader().concat([
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                        },
                    },
                ]),
            },
        ],
    },
    plugins: [
        // 定义全局注入变量
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': isDevelopment ? '"development"' : '"production"',
        }),
        // 保持模块的 hash id 不变
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        // 提取出来的所有 css 文件整合
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        // 复制文件
        new CopyWebpackPlugin([{
            ignore: ['.*'],
            from: assert,
            to: isDevelopment ? publicPath : output,
        }]),
        // 打包后的文件插入 html 模板
        new HtmlWebpackPlugin({
            filename: 'index.html',
            data: {
                build: version,
                year: new Date().getFullYear(),
            },
            template: resolve('index.html'),
            inject: true,
            minify: {
                removeComments: !isDevelopment,
                collapseWhitespace: !isDevelopment,
                ignoreCustomComments: [/^-/],
            },
            chunksSortMode: 'dependency',
            excludeChunks: [],
        }),
        new ProgressBarPlugin({
            width: 40,
            format: `${Chalk.green('> building:')} [:bar] ${Chalk.green(':percent')} (:elapsed seconds)`,
        }),
    ],
};

export default baseConfig;
