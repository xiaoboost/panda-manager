import webpack from 'webpack';
import rm from 'rimraf';

import { getBaseConfig } from './webpack';
import { CommandOptions, buildConfigs, resolveCWD } from './utils';

export function build(opt: CommandOptions) {
  return new Promise<void>((resolve) => {
    const compilerConfigs = buildConfigs.map((item) => getBaseConfig({
      ...opt,
      ...item,
    }));

    rm.sync(resolveCWD(opt.outDir));

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
