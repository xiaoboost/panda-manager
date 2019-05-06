import Webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { resolveRoot, main } from '../env';

const { resolve, output, publicPath } = main;
const isDevelopment = process.env.NODE_ENV === 'development';

type WebpackConfig = GetArrayItem<Parameters<typeof Webpack>[0]>;

const baseConfig: WebpackConfig = {
    mode: process.env.NODE_ENV as WebpackConfig['mode'],
    entry: resolve('main.ts'),
    target: 'electron-main',
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        path: output,
        publicPath,
        filename: 'main.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        mainFiles: ['index.ts'],
        alias: {
            src: resolve('src'),
            shared: resolve('src/shared'),
        },
        plugins: [
            new TsconfigPathsPlugin({
                configFile: resolveRoot('tsconfig.build.main.json'),
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
                    configFile: resolveRoot('tsconfig.build.main.json'),
                },
            },
        ],
    },
    externals: {
        tslib: 'require("tslib/tslib.js")',
    },
    plugins: [
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

export default baseConfig;
