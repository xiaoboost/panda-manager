import webpack from 'webpack';
import fs from 'fs-extra';

import { CommandOptions } from './types';
import { ProjectConfig } from '../utils/types';
import { resolveCWD } from '../utils/env';
import { buildManifest } from '../utils/package';
import { getBuildConfig } from '../utils/config';
import { getBaseConfig } from '../utils/webpack';

function buildWebpack(opt: CommandOptions, configs: ProjectConfig[]) {
  const compilerConfigs = configs.map((item) => getBaseConfig(opt, item));
  const compiler = webpack(compilerConfigs);

  compiler.watch({ ignored: /node_modules/ }, (err, stats) => {
    console.log('\x1Bc');

    if (err) {
      console.error(err.stack || err);
    } else if (stats) {
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

      console.log('\n  ⚡ Build complete. Watching...\n');
    }
  });
}

export async function watch(opt: CommandOptions) {
  const outDir = resolveCWD(opt.outDir);
  const configs = await getBuildConfig(resolveCWD());

  await fs.remove(outDir);
  await buildManifest(outDir);
  await buildWebpack(opt, configs);
}
