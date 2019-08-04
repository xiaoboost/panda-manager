import Webpack from 'webpack';

import { main } from '../env';
import { webpackBaseConfig } from '../utils';

const { resolve, output, publicPath } = main;

const baseConfig: Webpack.Configuration = {
    ...webpackBaseConfig('main'),

    entry: resolve('main.ts'),

    output: {
        path: output,
        publicPath,
        filename: 'main.js',
    },
};

export default baseConfig;
