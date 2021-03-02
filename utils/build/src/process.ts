import * as print from './print';
import * as path from 'path';

import { isWatch } from './env';
import { readConfig } from './config';

import { writeFile, mkdirp } from "@panda/fs";
import { build as esbuild, BuildResult } from 'esbuild';

async function writeOutputs(result: BuildResult) {
  const files = result.outputFiles ?? [];
  const pathMap: Record<string, boolean> = {};

  for (const file of files) {
    const dirname = path.dirname(file.path);

    if (!pathMap[dirname]) {
      await mkdirp(dirname);
      pathMap[dirname] = true;
    }

    await writeFile(file.path, file.contents);
  }
}

/** 编译 */
export async function build() {
  const start = Date.now();
  const cwd = process.cwd();
  const config = await readConfig(cwd);
  const result = await esbuild(config);

  await writeOutputs(result);

  if (!isWatch) {
    print.summary(start, cwd, result);
  }
}
