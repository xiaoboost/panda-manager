const { yellow, green } = require('chalk');
const { createBuildTag } = require('../utils');
const { render: config, resolveRoot } = require('../config');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

// 清空屏幕
console.log('\x1Bc');
console.log(yellow('> Start Compile:\n'));

module.exports = {
    mode: process.env.NODE_ENV,
    entry: config.resolve('main.tsx'),
    target: 'electron-renderer',
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        // 编译输出的静态资源根路径
        path: config.output,
        // 公共资源路径
        publicPath: config.publicPath,
        // 编译输出的文件名
        filename: isDevelopment
            ? 'js/[name].js'
            : 'js/[name].[chunkhash].js',
        // chunk 资源的命名
        chunkFilename: isDevelopment
            ? 'js/[name].js'
            : 'js/[name].[chunkhash].js',
    },
    resolve: {
        // 自动补全的扩展名
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.styl'],
        // 目录下的默认主文件
        mainFiles: ['index.tsx', 'index.ts'],
        // 默认路径别名
        alias: {
            'src': config.resolve('./'),
            'object-assign': resolveRoot('node_modules/object-assign/index.js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    /** 
                     * a relative path to the configuration file.
                     * It will be resolved relative to the respective `.ts` entry file.
                     */
                    configFile: '../tsconfig.render.json',
                },
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'stylus-loader',
                ],
            },
        ],
    },
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'common',
                    chunks: 'initial',
                },
            },
        },
    },
    plugins: [
        // 定义全局注入变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': isDevelopment ? '"development"' : '"production"',
        }),
        // 保持模块的 hash id 不变
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        // 提取出来的所有 css 文件整合
        new MiniCssExtractPlugin({
            filename: isDevelopment
                ? 'css/main.css'
                : 'css/main.[contenthash:20].css',
        }),
        // 复制文件
        new CopyWebpackPlugin([{
            ignore: ['.*'],
            from: config.assert,
            to: isDevelopment
                ? config.publicPath
                : config.output,
        }]),
        // 打包后的文件插入 html 模板
        new HtmlWebpackPlugin({
            filename: 'index.html',
            data: {
                build: createBuildTag(),
                year: new Date().getFullYear(),
            },
            template: config.resolve('index.html'),
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
            format: `${green('> building:')} [:bar] ${green(':percent')} (:elapsed seconds)`,
        }),
    ],
};
