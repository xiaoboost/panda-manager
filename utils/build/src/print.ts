import chalk from "chalk";
import path from "path";
import { BuildResult } from "esbuild";

export function summary(start: number, dir: string, result: BuildResult) {
  const end = Date.now();
  const fileInfos = (result.outputFiles ?? []).map((file) => {
    return {
      path: path.relative(dir, file.path),
      size: file.contents.length,
    };
  });

  const maxLen = Math.max(...fileInfos.map((info) => info.path.length)) + 2;

  console.log();

  fileInfos.forEach((info) => {
    const dirname = path.join(path.dirname(info.path), "/");
    const basename = path.basename(info.path);
    const pathStr = "".padEnd(maxLen - info.path.length, " ");
    const sizeStr = size(info.size);

    console.log(
      `   ${chalk.white(dirname)}${chalk.bold(basename)}${pathStr}`,
      sizeStr
    );
  });

  console.log(chalk.green("\n⚡ Done in", end - start, "ms\n"));
}

export function size(size: number) {
  const unit = ["b", "kb", "mb", "gb"];

  let number = size;
  let unitIndex = 0;

  while (number > 1024) {
    number = Number.parseFloat((number / 1024).toFixed(2));
    unitIndex++;
  }

  if (unitIndex < 2) {
    return chalk.blue(`${number}${unit[unitIndex]}`);
  }
  else {
    return chalk.yellow(`${number}${unit[unitIndex]} ⚠️`);
  }
}
