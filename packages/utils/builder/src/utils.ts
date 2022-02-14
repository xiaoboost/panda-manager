import path from 'path';
import webpack from 'webpack';

/** 编译选项 */
export interface CommandOptions {
  outDir: string;
  mode: string;
  watch: boolean;
  bundleAnalyze: boolean;
}

/** webpack 配置选项 */
export interface WebpackOptions {
  name: string;
  process: 'main' | 'renderer' | 'preload';
}

export const buildConfigs: WebpackOptions[] = [
  {
    name: '@panda/client',
    process: 'main',
  },
  {
    name: '@panda/renderer',
    process: 'renderer',
  },
  {
    name: '@panda/preload',
    process: 'preload',
  },
];

function createResolve(base: string) {
  return function resolve(...paths: (string | number)[]) {
    return path.join(base, ...paths.map(String)).replace(/\\/g, '/');
  }
}

export const resolveCWD = createResolve(process.cwd());

export const resolve = createResolve(path.join(__dirname, '..'));

export function getPackageResolve(name: string) {
  return createResolve(path.join(__dirname, '../node_modules', name));
}

function isIgnoreError(err: webpack.WebpackError) {
  if (!err.message.includes('Critical dependency')) {
    return false;
  }

  const context = err.module.context;

  if (!context) {
    return false;
  }

  const ignoreModule = ['@babel', 'typescript', 'power-assert-formatter'];

  return ignoreModule.some((name) => {
    return context.includes(name);
  });
}

export function printWebpackResult(stats: webpack.Stats) {
  stats.compilation.warnings = stats.compilation.warnings.filter((item) => {
    return !isIgnoreError(item);
  });

  console.log('\x1Bc');
  console.log(
    stats.toString({
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      modules: false,
      children: false,
    }),
  );

  console.log('\n  ⚡ Build complete.\n');
}
