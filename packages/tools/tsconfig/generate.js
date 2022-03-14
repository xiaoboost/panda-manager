const { promises: fs } = require('fs');
const path = require('path');
const package = require('./package.json');

/** 子包文件夹 */
const packageDir = 'packages';
/** 项目配置文件 */
const packageConfigName = 'package.json';
/** 忽略文件夹 */
const ignoreDir = ['node_modules', 'dist'];

async function getRootPath() {
  let current = __dirname;

  const isRoot = async (dir) => {
    const [lock, workspace] = await Promise.all([
      fs.stat(path.join(dir, 'pnpm-lock.yaml')).catch(() => void 0),
      fs.stat(path.join(dir, 'pnpm-workspace.yaml')).catch(() => void 0),
    ]);

    return Boolean(lock?.isFile()) && Boolean(workspace?.isFile());
  };

  while (!(await isRoot(current))) {
    const last = current;

    current = path.dirname(current);

    if (last === current) {
      throw new Error('未找到项目根目录');
    }
  }

  return current;
}

async function isDirectory(dir) {
  const dirStat = await fs.stat(dir).catch(() => void 0);
  return dirStat?.isDirectory() ?? false;
}

async function isPackage(dir) {
  const packageFilePath = path.join(dir, packageConfigName);
  const packageFile = await fs.stat(packageFilePath).catch(() => void 0);
  return packageFile?.isFile?.() ?? false;
}

async function getPackageDirs(input) {
  // 当前不是文件夹
  if (!(await isDirectory(input))) {
    return [];
  }

  // 当前文件夹是包
  if (await isPackage(input)) {
    return [input];
  }

  const allDirs = await fs.readdir(input);
  const dirs = await Promise.all(
    allDirs
      .filter((name) => !ignoreDir.includes(name))
      .map((name) => getPackageDirs(path.join(input, name))),
  );

  return dirs.reduce((ans, item) => ans.concat(item), []);
}

async function getPackageData(dirs) {
  return dirs.map((dir) => ({
    dir,
    ...require(path.join(dir, packageConfigName)),
  }));
}

async function readBaseConfig() {
  const baseConfigFilePath = path.join(__dirname, 'tsconfig.base.json');
  const fileContent = await fs.readFile(baseConfigFilePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function writeTsConfig(packages) {
  const baseConfig = await readBaseConfig();

  if (!baseConfig.compilerOptions) {
    baseConfig.compilerOptions = {};
  }

  if (!baseConfig.compilerOptions.paths) {
    baseConfig.compilerOptions.paths = {};
  }

  const { paths } = baseConfig.compilerOptions;

  paths['@xiao-ai/utils/*'] = ['./node_modules/@xiao-ai/utils/dist/types/*'];

  for (const data of packages) {
    if (data.exports) {
      paths[`${data.name}/*`] = [
        `${path.relative(__dirname, data.dir).replace(/[\\/]/g, '/')}/src/*`,
      ];
    }
  }

  await fs.writeFile(path.join(__dirname, package.main), JSON.stringify(baseConfig, null, 2));
}

async function main() {
  const rootPath = await getRootPath();
  const packageDirs = await getPackageDirs(path.join(rootPath, packageDir));
  const packageData = await getPackageData(packageDirs);

  await writeTsConfig(packageData);

  console.log(' > Build Complete.');
}

main();
