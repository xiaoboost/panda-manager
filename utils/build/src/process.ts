import type { BuildResult } from 'esbuild';

import * as print from './print';
import { promises as fs } from "fs";
import { isWatch } from './env';
import { readConfig } from './config';
import { build as esbuild } from 'esbuild';

async function writeOutputs(result: BuildResult) {
  const files = result.outputFiles ?? [];

  for (const file of files) {
    await fs.writeFile(file.path, file.contents);
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
