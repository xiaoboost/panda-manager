import Webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { resolvePackage, resolveRoot } from '../../build/utils';

const resolve = resolvePackage('process-main');

/** 编译配置 */
export const webpackConfig: Webpack.Configuration = {
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: resolve('src/index.ts'),
    output: {
        path: resolveRoot('dist/main'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        mainFiles: ['index.ts', 'index.js'],
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
};
