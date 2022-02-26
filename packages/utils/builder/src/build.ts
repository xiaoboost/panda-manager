import webpack from 'webpack';
import fs from 'fs-extra';

import { getBaseConfig } from './webpack';
import { CommandOptions, buildConfigs, resolveCWD, buildPackage } from './utils';

function buildWebpack(opt: CommandOptions) {
  return new Promise<void>((resolve) => {
    const compilerConfigs = buildConfigs.map((item) => getBaseConfig({
      ...opt,
      ...item,
    }));

    webpack(compilerConfigs, (err, stats) => {
      console.log('\x1Bc');

      if (err) {
        throw err;
      }

      if (stats) {
        console.log(stats.toString({
          chunks: false,
          chunkModules: false,
          chunkOrigins: false,
          colors: true,
          modules: false,
          children: false,
        }));

        console.log('\n  ⚡ Build complete.\n');
      }

      resolve();
    });
  });
}

export async function build(opt: CommandOptions) {
  const outDir = resolveCWD(opt.outDir);

  await fs.remove(outDir);
  await buildPackage(resolveCWD(), outDir);
  await buildWebpack(opt);
}
