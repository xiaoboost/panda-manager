process.env.NODE_ENV = 'development';

import { main } from '../env';
import { removeSync as rm } from 'fs-extra';

import Webpack from 'webpack';
import BaseConfig from './webpack.base';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

// 删除输出文件夹
rm(main.output);

// 每个模块用 eval() 执行, SourceMap 作为 DataUrl 添加到文件末尾
BaseConfig.devtool = 'eval-source-map';

// 调试用的插件
BaseConfig.plugins!.push(
    new Webpack.NamedModulesPlugin(),
    new Webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: ['Main script done.'],
            notes: [],
        },
    }),
);

const compiler = Webpack(BaseConfig);

compiler.watch(
    { ignored: /node_modules/ },
    (err?: Error) => (
        (err && console.error(err.stack || err)) ||
        (err && (err as any).details && console.error((err as any).details))
    ),
);
