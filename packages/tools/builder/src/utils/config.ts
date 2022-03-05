import fs from 'fs-extra';
import ts from 'typescript';
import path from 'path';

import { runScript } from '@xiao-ai/utils/node';
import { BuildConfig } from '../builder';
import { ProjectConfig } from './types';

/** 子包文件夹 */
const packageDir = 'packages';
/** 项目配置文件 */
const packageConfigName = 'package.json';
/** 工程配置文件 */
const buildConfigFile = 'build.config.ts';
/** 忽略文件夹 */
const ignoreDir = ['node_modules', 'dist'];

async function readConfig(dir: string): Promise<ProjectConfig> {
  const file = path.join(dir, buildConfigFile);
  const code = await fs.readFile(file, 'utf-8');
  const transformed = ts.transpile(code, {
    target: ts.ScriptTarget.ES2015,
    module: ts.ModuleKind.CommonJS,
  });
  const data = runScript<BuildConfig>(transformed, {
    filename: file,
    dirname: path.dirname(file),
  });
  const packageData = await fs.readJSON(path.join(dir, packageConfigName));

  if (data.error) {
    throw new Error(data.error.message);
  }

  return {
    ...data.output,
    name: packageData.name,
    dirname: path.dirname(file),
    output: data.output.output,
    html: data.output.html ?? 'src/index.html',
    tsConfigFile: data.output.tsConfigFile ?? 'tsconfig.json',
  };
}

async function isDirectory(dir: string) {
  const dirStat = await fs.stat(dir);
  return dirStat?.isDirectory() ?? false;
}

async function hasBuildConfig(dir: string) {
  const packageFilePath = path.join(dir, packageConfigName);
  const buildConfigPath = path.join(dir, buildConfigFile);
  const [packageFile, buildFile] = await Promise.all([
    fs.stat(packageFilePath).catch(() => void 0),
    fs.stat(buildConfigPath).catch(() => void 0),
  ]);

  return Boolean(packageFile?.isFile?.() && buildFile?.isFile?.());
}

async function getHasBuildConfigPackage(input: string): Promise<string[]> {
  // 当前不是文件夹
  if (!(await isDirectory(input))) {
    return [];
  }

  // 当前文件夹是包
  if (await hasBuildConfig(input)) {
    return [input];
  }

  const allDirs = await fs.readdir(input);
  const dirs = await Promise.all(
    allDirs
      .filter((name) => !ignoreDir.includes(name))
      .map((name) => getHasBuildConfigPackage(path.join(input, name))),
  );

  return dirs.reduce((ans, item) => ans.concat(item), []);
}

/** 获取所有工程配置 */
export async function getBuildConfig(root: string) {
  const packages = await getHasBuildConfigPackage(path.join(root, packageDir));
  return await Promise.all(packages.map((dir) => readConfig(dir)));
}
