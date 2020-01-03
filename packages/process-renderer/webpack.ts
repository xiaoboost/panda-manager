import Webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { loader } from 'mini-css-extract-plugin';
import { resolvePackage, resolveRoot } from '../../build/utils';

const resolve = resolvePackage('process-renderer');
const isDevelopment = process.env.NODE_ENV === 'development';
const styleLoader = isDevelopment ? 'style-loader' : loader;

/** 编译配置 */
export const webpackConfig: Webpack.Configuration = {
    target: 'electron-renderer',
    entry: resolve('src/init/index.ts'),
    output: {
        path: resolveRoot('dist/renderer'),
        publicPath: './',
        filename: 'script.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.styl', '.less', '.css'],
        mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.styl', 'index.less', 'index.css'],
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
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                test: /\.css$/,
                use: [styleLoader, 'css-loader'],
            },
            {
                test: /\.less$/,
                include: /node_modules/,
                use: [styleLoader, 'css-loader', 'less-loader'],
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    styleLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            localsConvention: 'camelCaseOnly',
                            modules: {
                                localIdentName: isDevelopment ? '[local]__[hash:base64:5]' : '[hash:base64:6]',
                                context: resolve('src'),
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            paths: [resolve('src')],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('src/index.html'),
            inject: true,
            minify: {
                removeComments: !isDevelopment,
                collapseWhitespace: !isDevelopment,
                ignoreCustomComments: [/^-/],
            },
            chunksSortMode: 'dependency',
            excludeChunks: [],
        }),
    ],
};
