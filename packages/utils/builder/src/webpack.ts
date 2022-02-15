import webpack from 'webpack';

import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import {
  resolve,
  resolveCWD,
  getPackageResolve,
  CommandOptions,
  WebpackOptions,
} from './utils';

let port = 6060;

export function getBaseConfig(opt: CommandOptions & WebpackOptions): webpack.Configuration {
  const outDir = resolveCWD(opt.outDir, opt.output ?? opt.process);
  const resolvePackage = getPackageResolve(opt.name);
  const tsLoaderConfig = opt.mode === 'development'
    ? {
      loader: 'ts-loader',
      options: {
        configFile: resolve('src/tsconfig.json'),
        compilerOptions: {
          module: 'ESNext',
          target: 'ESNext',
        },
      },
    }
    : {
      loader: 'esbuild-loader',
      options: {
        loader: 'tsx',
        target: 'es2015',
        tsconfigRaw: require(resolve('src/tsconfig.json')),
      },
    };

  const baseConfig: webpack.Configuration = {
    mode: opt.mode as webpack.Configuration['mode'],
    entry: {
      index: resolvePackage(opt.entry ?? 'src/index.ts'),
    },
    output: {
      path: outDir,
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: './',
    },
    resolveLoader: {
      modules: [resolve('node_modules'), resolvePackage('node_modules')],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.json'],
      mainFields: ['source', 'module', 'main'],
      alias: {
        src: resolvePackage('src'),
        '@xiao-ai/utils/web': resolvePackage('node_modules/@xiao-ai/utils/dist/esm/web/index.js'),
        '@xiao-ai/utils/use': resolvePackage('node_modules/@xiao-ai/utils/dist/esm/use/index.js'),
      },
    },
    module: {
      rules: [
        {
          test: /\.worker\.tsx?$/,
          use: [
            'worker-loader',
            tsLoaderConfig,
          ],
        },
        {
          test: /\.tsx?$/,
          ...tsLoaderConfig,
        },
        {
          test: /\.(png|jpg|webp|svg)$/i,
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      ],
    },
    optimization: {
      concatenateModules: true,
      moduleIds: 'deterministic',
      splitChunks: {
        maxInitialRequests: Infinity,
        minSize: 0,
        minChunks: 1,
        cacheGroups: {
          commons: {
            test(module: any) {
              return (
                module.resource &&
                /[\\/]node_modules[\\/]/.test(module.resource)
              );
            },
            name: 'common',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(opt.mode),
      }),
    ],
  };

  if (opt.mode === 'development') {
    baseConfig.devtool = 'source-map';
  }
  else {
    baseConfig.devtool = false;

    if (!baseConfig.optimization) {
      baseConfig.optimization = {
        minimize: true,
      };
    }

    if (!baseConfig.optimization.minimizer) {
      baseConfig.optimization.minimizer = [];
    }

    baseConfig.optimization.minimizer = baseConfig.optimization.minimizer.concat([
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          ecma: 2020,
          module: false,
          ie8: false,
          safari10: false,
        },
      }),
    ]);

    baseConfig.performance = {
      hints: false,
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    };

    if (opt.bundleAnalyze) {
      baseConfig.plugins!.push(new BundleAnalyzerPlugin({
        analyzerPort: port++,
      }));
    }
  }

  if (opt.process === 'renderer') {
    baseConfig.plugins?.push(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolvePackage('src/index.html'),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          ignoreCustomComments: [/^-/],
        },
      }),
    );
  }

  baseConfig.target = `electron-${opt.process}`;

  return baseConfig;
}