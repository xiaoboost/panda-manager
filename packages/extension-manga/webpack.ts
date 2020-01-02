import Webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { resolvePackage, resolveRoot } from '../../build/utils';

const resolve = resolvePackage('process-manga');
const isDevelopment = process.env.NODE_ENV === 'development';

/** 编译配置 */
export const webpackConfig: Webpack.Configuration = {
    target: 'electron-renderer' as Webpack.Configuration['target'],
    entry: resolve('src/index.ts'),
    output: {
        path: resolveRoot('dist/modules'),
        filename: 'manga.js',
    },
    optimization: {
        minimizer: [],
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
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                include: /node_modules/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
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
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': isDevelopment
                ? '"development"'
                : '"production"',
        }),
    ],
};
