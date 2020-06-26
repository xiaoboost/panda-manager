import Webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import {
    modeName,
    resolve,
    outputDir,
    builtinModules,
    isDevelopment,
    isAnalyzer,
} from './utils';

/** 公共配置 */
export const rendererConfig: Webpack.Configuration = {
    target: 'electron-renderer',
    externals: builtinModules,
    mode: modeName,
    entry: {
        renderer: resolve('src/renderer/init/index.ts'),
    },
    output: {
        path: outputDir,
        filename: 'scripts/[name].js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.styl', '.css'],
        mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.styl', 'index.css'],
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
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.styl$/,
                include: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            localsConvention: 'camelCaseOnly',
                            modules: {
                                context: resolve('src/renderer'),
                                localIdentName: isDevelopment
                                    ? '[local]__[hash:base64:5]'
                                    : '[hash:base64:6]',
                            },
                        },
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            paths: [resolve('src/renderer')],
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
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(modeName),
        }),
        new HtmlWebpackPlugin({
            filename: 'pages/renderer.html',
            template: resolve('src/renderer/index.html'),
            inject: true,
            excludeChunks: [],
            chunks: ['renderer'],
            minify: {
                removeComments: !isDevelopment,
                collapseWhitespace: !isDevelopment,
                ignoreCustomComments: [/^-/],
            },
        }),
    ],
};

if (isDevelopment) {
    rendererConfig.watch = true;
    rendererConfig.devtool = 'source-map';
    rendererConfig.plugins = rendererConfig.plugins!.concat([
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: ['Project compile done.'],
                notes: [],
            },
        }),
    ]);
}
else {
    rendererConfig.optimization!.minimize = true;
    rendererConfig.optimization!.minimizer = [
        new OptimizeCSSPlugin(),
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

    if (isAnalyzer) {
        rendererConfig.plugins = rendererConfig.plugins!.concat([
            new BundleAnalyzerPlugin({
                analyzerPort: 9876,
            }),
        ]);
    }
}
