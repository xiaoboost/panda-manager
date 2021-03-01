import { build as esbuild } from "esbuild";

import { summary } from "./print";
import { readConfig } from "./config";
import { writeOutputs } from "./output";

export async function build() {
  const start = Date.now();
  const cwd = process.cwd();
  const config = await readConfig(cwd);
  const result = await esbuild(config);

  await writeOutputs(result);

  summary(start, cwd, result);
}

export * from './env';
export { ConfigFile, ConfigContext } from './config';
