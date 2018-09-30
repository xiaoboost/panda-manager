const webpack = require('webpack');
const { main: config } = require('../config');
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    mode: process.env.NODE_ENV,
    entry: config.resolve('main.ts'),
    target: 'electron-main',
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        path: config.output,
        publicPath: config.publicPath,
        filename: 'main.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.styl'],
        mainFiles: ['index.tsx', 'index.ts'],
        alias: {
            'src': config.resolve('./'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    /** 
                     * a relative path to the configuration file.
                     * It will be resolved relative to the respective `.ts` entry file.
                     */
                    configFile: '../tsconfig.main.json',
                },
            },
        ],
    },
    externals: {
        tslib: 'require("tslib/tslib.js")',
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': isDevelopment ? '"development"' : '"production"',
        }),
    ],
};
