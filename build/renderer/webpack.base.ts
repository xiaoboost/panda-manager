import Webpack from 'webpack';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';

import { renderer } from '../env';
import { webpackBaseConfig, version } from '../utils';

const { resolve, assert, output, publicPath } = renderer;

const isDevelopment = process.env.NODE_ENV === 'development';

const baseConfig: Webpack.Configuration = {
    ...webpackBaseConfig('renderer'),

    entry: resolve('main.tsx'),

    output: {
        path: output,
        publicPath,
        filename: '[name].js',
    },
};

baseConfig.plugins = baseConfig.plugins!.concat([
    new OptimizeCSSPlugin(),
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
        format: '> building: [:bar] :percent (:elapsed seconds)',
    }),
]);

export default baseConfig;
