process.env.NODE_ENV = 'production';

import { render } from '../env';
import { removeSync as rm } from 'fs-extra';

import Chalk from 'chalk';
import Webpack from 'webpack';
import BaseConfig from './webpack.base';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';

BaseConfig.plugins!.push(
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new OptimizeCSSPlugin(),
);

if (!BaseConfig.optimization) {
    BaseConfig.optimization = {};
}

if (!BaseConfig.optimization.minimizer) {
    BaseConfig.optimization.minimizer = [];
}

BaseConfig.optimization.minimizer.push(
    new TerserPlugin({
        test: /\.js$/i,
        cache: false,
        terserOptions: {
            ecma: 7,
            ie8: false,
            safari10: false,
            output: {
                comments: /^!/,
            },
        },
    }),
);

rm(render.output);

Webpack(BaseConfig, (err, stats) => {
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

    console.log(Chalk.cyan('\n  Build complete.\n'));
});
