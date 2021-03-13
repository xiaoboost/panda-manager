import { readConfig, mergeConfig } from './config';
import { build as esbuild, BuildOptions } from 'esbuild';

/** 命令行编译 */
export async function cli() {
  await esbuild(await readConfig(process.cwd()));
}

/** 编译 */
export function build(opt?: BuildOptions) {
  return esbuild(mergeConfig(opt));
}
