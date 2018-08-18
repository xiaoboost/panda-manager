process.env.NODE_ENV = 'development';

const { rm } = require('shelljs');
const { main } = require('../config');

const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// 删除输出文件夹
rm('-rf', main.output);

// 调试用的插件
baseConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: ['Main script done.'],
        },
    })
);

const compiler = webpack(baseConfig);

compiler.watch(
    { ignored: /node_modules/ },
    (err) => (
        (err && console.error(err.stack || err)) ||
        (err && err.details && console.error(err.details))
    )
);
