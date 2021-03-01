import chalk from 'chalk';
import path from 'path';
import { BuildResult } from "esbuild";

export function summary(start: number, dir: string, result: BuildResult) {
  const end = Date.now();
  const fileInfos = (result.outputFiles ?? []).map((file) => {
    return {
      path: path.relative(dir, file.path),
      size: file.contents.length,
    };
  });

  console.log(fileInfos);

  console.log(chalk.green('⚡ Done in', end - start, 'ms'));
}

export function size(size: number) {
  // ..
}
