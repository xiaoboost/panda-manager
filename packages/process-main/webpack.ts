import Webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { webpackAlias, resolvePackage, resolveRoot } from '../../build/utils';

const resolve = resolvePackage('process-main');
const isDevelopment = process.env.NODE_ENV === 'development';

/** 编译配置 */
export const webpackConfig: Webpack.Configuration = {
    mode: process.env.NODE_ENV as Webpack.Configuration['mode'],
    target: 'electron-main' as Webpack.Configuration['target'],
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: resolve('src/index.ts'),
    output: {
        path: resolveRoot('dist/main'),
        filename: 'index.js',
    },
    optimization: {
        minimizer: [],
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        mainFiles: ['index.ts', 'index.js'],
        alias: webpackAlias(),
        plugins: [
            new TsconfigPathsPlugin({
                configFile: resolve('tsconfig.json'),
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: resolve('tsconfig.json'),
                },
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
