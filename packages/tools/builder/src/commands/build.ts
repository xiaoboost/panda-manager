import webpack from 'webpack';
import fs from 'fs-extra';

import { CommandOptions } from './types';
import { ProjectConfig } from '../utils/types';
import { resolveCWD } from '../utils/env';
import { buildManifest } from '../utils/package';
import { getBuildConfig } from '../utils/config';
import { getBaseConfig } from '../utils/webpack';

function buildWebpack(opt: CommandOptions, configs: ProjectConfig[]) {
  return new Promise<void>((resolve) => {
    const compilerConfigs = configs.map((item) => getBaseConfig(opt, item));

    webpack(compilerConfigs, (err, stats) => {
      console.log('\x1Bc');

      if (err) {
        throw err;
      }

      if (stats) {
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

      resolve();
    });
  });
}

export async function build(opt: CommandOptions) {
  const outDir = resolveCWD(opt.outDir);
  const configs = await getBuildConfig(resolveCWD());

  await fs.remove(outDir);
  await buildManifest(outDir);
  await buildWebpack(opt, configs);
}
