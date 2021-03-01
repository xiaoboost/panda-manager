import { BuildResult } from "esbuild";
import { promises as fs } from "fs";

export async function writeOutputs(result: BuildResult) {
  const files = result.outputFiles ?? [];

  for (const file of files) {
    await fs.writeFile(file.path, file.contents);
  }
}
