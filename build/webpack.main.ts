import Webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import GenerateJsonPlugin from 'generate-json-webpack-plugin';
import PackageConfig from '../package.json';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { RequireSplitChunkPlugin } from 'require-split-chunk-webpack-plugin';

import {
    modeName,
    resolve,
    outputDir,
    builtinModules,
    externalModules,
    isDevelopment,
    isAnalyzer,
} from './utils';

/** 公共配置 */
export const clientConfig: Webpack.Configuration = {
    target: 'electron-main',
    externals: builtinModules.concat(externalModules),
    mode: modeName,
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: resolve('src/main/index.ts'),
    output: {
        path: outputDir,
        filename: 'scripts/client.js',
        libraryTarget: 'commonjs',
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
    performance: {
        hints: false,
        maxEntrypointSize: 2048000,
        maxAssetSize: 2048000,
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
            'process.env.NODE_ENV': JSON.stringify(modeName),
        }),
        new GenerateJsonPlugin('package.json', {
            name: PackageConfig.name,
            version: PackageConfig.version,
            description: PackageConfig.description,
            main: PackageConfig.main,
            author: PackageConfig.author,
        }),
    ],
};

if (isDevelopment) {
    clientConfig.watch = true;
    clientConfig.devtool = 'source-map';
    clientConfig.externals = builtinModules.concat(externalModules);
    clientConfig.plugins = clientConfig.plugins!.concat([
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: ['Project compile done.'],
                notes: [],
            },
        }),
    ]);
}
else {
    clientConfig.optimization = {
        minimize: true,
        splitChunks: {
            maxInitialRequests: Infinity,
            minSize: 0,
            minChunks: 1,
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'main-common',
                    chunks: 'all',
                },
            },
        },
        minimizer: [
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
        ],
    };

    clientConfig.plugins = clientConfig.plugins!.concat([
        new RequireSplitChunkPlugin(),
    ]);

    if (isAnalyzer) {
        clientConfig.plugins = clientConfig.plugins!.concat([
            new BundleAnalyzerPlugin({
                analyzerPort: 9876,
            }),
        ]);
    }
}
