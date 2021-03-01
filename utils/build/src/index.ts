import { build as esbuild } from "esbuild";

import { summary } from './print';
import { readConfig } from './config';
import { writeOutputs } from './output';

async function main() {
  const start = Date.now();
  const cwd = process.cwd();
  const config = await readConfig(cwd);
  const result = await esbuild(config);

  await writeOutputs(result);

  summary(start, cwd, result);
}

main();
