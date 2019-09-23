import Webpack from 'webpack';

import { main } from '../env';
import { webpackBaseConfig } from '../utils';

const { resolve, output, publicPath } = main;

const baseConfig: Webpack.Configuration = {
    ...webpackBaseConfig('main'),

    entry: resolve('index.ts'),

    output: {
        path: output,
        publicPath,
        filename: 'index.js',
    },
};

export default baseConfig;
