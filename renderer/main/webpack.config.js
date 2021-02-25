const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');

const resolve = (...dir) => path.join(__dirname, ...dir);
const isDevelopment = process.argv.includes('development');
const stylusOptions = {
    paths: [
        resolve('node_modules'),
        resolve('src'),
    ],
};

const config = {
    target: 'electron-renderer',
    devtool: 'source-map',
    entry: {
        renderer: resolve('src/init/index.ts'),
    },
    output: {
        path: resolve('dist'),
        filename: 'scripts/[name].js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.styl', '.css'],
        mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.styl', 'index.css'],
        alias: {
            src: resolve('src'),
        },
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
                    configFile: resolve('tsconfig.build.json'),
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.styl$/,
                include: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'stylus-loader',
                        options: {
                            stylusOptions,
                        },
                    },
                ],
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentContext: resolve('src'),
                                exportLocalsConvention: "camelCaseOnly",
                                localIdentName: isDevelopment
                                    ? '[local]__[hash:base64:5]'
                                    : '[hash:base64:6]',
                            },
                        },
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            stylusOptions,
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
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'renderer-common',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ProgressBarWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
        new webpack.ids.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        new HtmlWebpackPlugin({
            filename: 'views/renderer.html',
            template: resolve('src/index.html'),
            inject: true,
            scriptLoading: 'blocking',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                ignoreCustomComments: [/^-/],
            },
        }),
    ],
};

if (!isDevelopment) {
    config.devtool = false;
    config.optimization.minimize = true;
    config.optimization.minimizer = [
        new CssMinimizerWebpackPlugin(),
        new TerserPlugin({
            test: /\.js$/i,
            terserOptions: {
                ie8: false,
                safari10: false,
                output: {
                    comments: /^!/,
                },
            },
        }),
    ];
}

module.exports = config;
