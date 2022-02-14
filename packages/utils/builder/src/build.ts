import webpack from 'webpack';

import { getBaseConfig } from './webpack';
import { CommandOptions, buildConfigs } from './utils';

export function build(opt: CommandOptions) {
  const compilerConfigs = buildConfigs.map((item) => getBaseConfig({
    ...opt,
    ...item,
  }));

  debugger;
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
  });
}
