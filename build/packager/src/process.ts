import { build as esbuild, BuildResult } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';

import * as path from 'path';
import * as files from './files';

import {
  isDevelopment,
  isProduction,
  isWatch,
} from './utils';

type ChunkMapping = Record<string, string>;

function updateOutput(result: BuildResult) {
  const chunkMapping: ChunkMapping = {
    'main/main/src': 'main',
    'renderer/main/src/init': 'view/renderer',
  };
  const mapping = Object.entries(chunkMapping).map(([key, value]) => [
    path.normalize(key),
    value,
  ]);
  const data = (result.outputFiles ?? []).map((file) => {
    let newPath = file.path;

    mapping.map(([origin, map]) => {
      const [before, after] = file.path.split(origin);

      if (after) {
        newPath = path.join(before, map, after);
      }
    });

    return {
      path: newPath,
      contents: file.contents,
    };
  });

  files.clear();
  files.push(...data);
}

async function bundle() {
  const result = await esbuild({
    entryPoints: [
      './main/main/src/index.ts',
      './renderer/main/src/init/index.ts',
    ],
    outdir: './dist/generate',
    platform: 'node',
    format: 'iife',
    target: 'es6',
    bundle: true,
    treeShaking: true,
    color: true,
    logLevel: 'warning',
    watch: !isWatch ? false : {
      onRebuild(err, result) {
        if (!err && result) {
          updateOutput(result);
          files.write();
        }
      },
    },
    minify: isProduction,
    external: ['electron'],
    mainFields: ["source", "module", "main"],
    write: false,
    define: {
      'process.env.NODE_ENV': isProduction
        ? '"production"'
        : '"development"',
    },
    plugins: [
      lessLoader(),
    ],
  });

  await updateOutput(result);
}

export async function cli() {
  await bundle();
  await files.write();
}
