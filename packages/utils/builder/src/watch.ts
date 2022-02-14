import webpack from 'webpack';
import rm from 'rimraf';

import { getBaseConfig } from './webpack';
import { CommandOptions, buildConfigs, resolveCWD } from './utils';

export function watch(opt: CommandOptions) {
  const compilerConfigs = buildConfigs.map((item) => getBaseConfig({
    ...opt,
    ...item,
  }));

  rm.sync(resolveCWD(opt.outDir));
}
