import webpack from 'webpack';

import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { ProjectConfig } from './types';
import { resolveCWD, resolveBuilder, getResolve, appData } from './env';
import { CommandOptions } from '../commands';

let port = 6060;

export function getBaseConfig(opt: CommandOptions, project: ProjectConfig): webpack.Configuration {
  const outDir = resolveCWD(opt.outDir, project.output);
  const resolveProject = getResolve(project.dirname);
  const tsConfigFile = resolveProject(project.tsConfigFile);
  const tsLoaderConfig =
    opt.mode === 'development'
      ? {
          loader: 'ts-loader',
          options: {
            configFile: tsConfigFile,
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
            target: 'esnext',
            tsconfigRaw: require(tsConfigFile),
          },
        };

  const baseConfig: webpack.Configuration = {
    mode: opt.mode as webpack.Configuration['mode'],
    entry: {
      index: resolveProject(project.entry),
    },
    output: {
      path: outDir,
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: './',
    },
    resolveLoader: {
      modules: [resolveBuilder('node_modules'), resolveProject('node_modules')],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.json'],
      mainFields: ['source', 'module', 'main'],
      alias: {
        src: resolveProject('src'),
      },
      plugins: [
        new TsconfigPathsPlugin({
          configFile: tsConfigFile,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.worker\.tsx?$/,
          use: ['worker-loader', tsLoaderConfig],
        },
        {
          test: /\.tsx?$/,
          ...tsLoaderConfig,
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|webp|svg|otf|ttf)$/i,
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '../assets/[name].[ext]',
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
              return module.resource && /[\\/]node_modules[\\/]/.test(module.resource);
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
        'process.env.VERSION': JSON.stringify(appData.version),
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
    ],
  };

  if (opt.mode === 'development') {
    baseConfig.devtool = 'source-map';
  } else {
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
      new CssMinimizerPlugin(),
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
      baseConfig.plugins!.push(
        new BundleAnalyzerPlugin({
          analyzerPort: port++,
        }),
      );
    }
  }

  if (project.process === 'renderer') {
    baseConfig.plugins?.push(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolveProject(project.html),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          ignoreCustomComments: [/^-/],
        },
      }),
    );
  }

  baseConfig.target = `electron-${project.process}`;

  return baseConfig;
}
