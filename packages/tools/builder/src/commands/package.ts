import electronPackager from 'electron-packager';

import { PackageOptions } from './types';
// import { resolveCWD, npmEnv } from './utils';

export async function generate(opt: PackageOptions) {
  // const result = await electronPackager({
  //   dir: resolveCWD(opt.input),
  //   out: resolveCWD(opt.output),
  //   appCopyright: `Copyright © 2022 ~ ${new Date().getFullYear()} xiaoboost`,
  //   asar: true,
  //   arch: 'x64',
  //   overwrite: true,
  //   platform: 'win32',
  //   download: {
  //     mirrorOptions: {
  //       mirror: npmEnv.electron_mirror,
  //     },
  //   },
  // });
  // console.log(`\n  ⚡ Package complete at ${result[0]}\n`);
}
