import { build as esbuild, BuildResult } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';

import * as fs from '@panda/fs';
import * as path from 'path';
import * as files from './files';
import * as utils from './utils';

import Glob from 'fast-glob';

function updateOutput(result: BuildResult) {
  const data = (result.outputFiles ?? []).map((file) => {
    return {
      path: utils.pathMapping(file.path),
      contents: file.contents,
    };
  });

  files.clear();
  files.push(...data);
}

async function copyFiles() {
  const root = utils.resolve();
  const ignoreFolder = ['node_modules', 'coverage', 'dist', '.git'];
  const ignore = `!**/{${ignoreFolder.join(',')}}/**`;
  const fsPaths = await Glob(['renderer/**/*.html', ignore], {
    cwd: root,
  });

  for (const fsPath of fsPaths) {
    const inputPath = path.join(root, fsPath);
    const replaced = utils.pathMapping(fsPath);

    files.push({
      path: path.join(utils.outputDir, replaced),
      contents: await fs.readFile(inputPath),
    });
  }
}

async function bundle() {
  const result = await esbuild({
    entryPoints: [
      './main/main/src/index.ts',
      './renderer/main/src/init/index.ts',
    ],
    outdir: utils.outputDir,
    platform: 'node',
    format: 'iife',
    target: 'es6',
    bundle: true,
    treeShaking: true,
    logLevel: 'warning',
    watch: !utils.isWatch ? false : {
      onRebuild(err, result) {
        if (!err && result) {
          updateOutput(result);
          files.write();
        }
      },
    },
    minify: utils.isProduction,
    external: ['electron'],
    mainFields: ["source", "module", "main"],
    sourcemap: utils.isDevelopment,
    write: false,
    define: {
      'process.env.NODE_ENV': utils.isProduction
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
  await copyFiles();
  await files.write();
}