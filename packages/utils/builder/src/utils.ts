import path from 'path';
import fs from 'fs-extra';
import webpack from 'webpack';

/** 编译选项 */
export interface CommandOptions {
  outDir: string;
  mode: string;
  watch: boolean;
  bundleAnalyze: boolean;
}

/** 打包选项 */
export interface PackageOptions {
  input: string;
  output: string;
}

/** webpack 配置选项 */
export interface WebpackOptions {
  name: string;
  entry?: string;
  output?: string;
  process: 'main' | 'renderer' | 'preload';
}

export const buildConfigs: WebpackOptions[] = [
  {
    name: '@panda/client',
    process: 'main',
  },
  {
    name: '@panda/preload',
    process: 'preload',
  },
  {
    name: '@panda/renderer',
    process: 'renderer',
    output: 'views/main',
    entry: 'src/init/index.ts',
  },
];

function createResolve(base: string) {
  return function resolve(...paths: (string | number)[]) {
    return path.join(base, ...paths.map(String)).replace(/\\/g, '/');
  }
}

export const resolveCWD = createResolve(process.cwd());

export const resolve = createResolve(path.join(__dirname, '..'));

export const appPackageData = fs.readJSONSync(resolveCWD('package.json'));

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

export async function buildPackage(input: string, output: string) {
  const packageFileName = 'package.json';
  const jsonString = await fs.readFile(path.join(input, packageFileName), 'utf-8');
  const json = JSON.parse(jsonString);

  await fs.mkdirp(output);
  await fs.writeFile(path.join(output, packageFileName), JSON.stringify({
    name: json.name,
    version: json.version,
    description: json.description,
    main: json.main,
    author: json.author,
    license: json.license,
  }));
}
