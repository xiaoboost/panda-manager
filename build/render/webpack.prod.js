process.env.NODE_ENV = 'production';

const { rm } = require('shelljs');
const { cyan } = require('chalk');
const { render } = require('../config');

const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

baseConfig.plugins.push(
    new webpack.optimize.ModuleConcatenationPlugin(),
    new OptimizeCSSPlugin(),
    new UglifyJSPlugin({
        test: /\.js$/i,
        cache: false,
        uglifyOptions: {
            ecma: 7,
            ie8: false,
            safari10: false,
            output: {
                comments: /^!/,
            },
        },
    })
);

rm('-rf', render.output);

webpack(baseConfig, (err, stats) => {
    if (err) {
        throw err;
    }

    console.log('\x1Bc');

    console.log(stats.toString({
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: true,
        modules: false,
        children: false,
    }));

    console.log(cyan('\n  Build complete.\n'));
});
