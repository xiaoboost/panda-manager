import webpack from 'webpack';
import fs from 'fs-extra';

import { getBaseConfig } from './webpack';
import { CommandOptions, buildConfigs, resolveCWD, buildPackage } from './utils';

function buildWebpack(opt: CommandOptions) {
  const compilerConfigs = buildConfigs.map((item) => getBaseConfig({
    ...opt,
    ...item,
  }));

  const compiler = webpack(compilerConfigs);

  compiler.watch(
    { ignored: /node_modules/ },
    (err, stats) => {
      console.log('\x1Bc');

      if (err) {
        console.error(err.stack || err);
      }
      else if (stats) {
        console.log(stats.toString({
          chunks: false,
          chunkModules: false,
          chunkOrigins: false,
          colors: true,
          modules: false,
          children: false,
        }));

        console.log('\n  ⚡ Build complete. Watching...\n');
      }
    },
  );
}

export async function watch(opt: CommandOptions) {
  const outDir = resolveCWD(opt.outDir);

  await fs.remove(outDir);
  await buildPackage(resolveCWD(), outDir);
  await buildWebpack(opt);
}
