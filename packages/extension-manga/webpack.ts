import Webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { resolvePackage, resolveRoot } from '../../build/utils';
import { mkdirp, readJSON, writeFile } from '../utils/src/node/file-system';

const outputDir = 'dist/extensions/manga';
const resolve = resolvePackage('extension-manga');
const isDevelopment = process.env.NODE_ENV === 'development';

async function writeManifest() {
    const data = await readJSON(resolve('package.json'));

    if (!data) {
        throw new Error('Can not found package.json');
    }

    await mkdirp(outputDir);
    await writeFile(resolveRoot(outputDir, 'manifest.json'), JSON.stringify({
        name: 'Manga',
        version: data['version'],
        main: 'index.js',
    }));
}

writeManifest();

/** 编译配置 */
export const webpackConfig: Webpack.Configuration = {
    target: 'electron-renderer' as Webpack.Configuration['target'],
    entry: resolve('src/index.ts'),
    devtool: 'nosources-source-map',
    output: {
        path: resolveRoot(outputDir),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.less', '.css'],
        mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.less', 'index.css'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: resolve('tsconfig.json'),
            }),
        ],
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
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                include: /node_modules/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            localsConvention: 'camelCaseOnly',
                            modules: {
                                localIdentName: isDevelopment ? '[local]__[hash:base64:5]' : '[hash:base64:6]',
                                context: resolve('src'),
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            paths: [resolve('src')],
                        },
                    },
                ],
            },
        ],
    },
};
