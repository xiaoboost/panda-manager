const { promises: fs } = require('fs');
const yaml = require('yaml');
const path = require('path');

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

async function getPackageConfig(root) {
  const workspaceContent = await fs.readFile(path.join(root, 'pnpm-workspace.yaml'), 'utf-8');
  const workspace = yaml.parse(workspaceContent);

  return workspace.packages.map((item) => {
    const isSubPackage = item.endsWith('/*');

    return {
      dirPath: path.join(root, item.replace(/\/\*/, '')),
      isSubPackage,
    };
  });
}

async function getPackages(root) {
  const packages = [];
  const packageConfigs = await getPackageConfig(root);

  async function readPackage(dir) {
    const stat = await fs.stat(dir).catch(() => void 0);

    if (!stat || !stat.isDirectory()) {
      return;
    }

    const packageContent = await fs
      .readFile(path.join(dir, 'package.json'), 'utf-8')
      .catch(() => void 0);

    if (packageContent) {
      const data = JSON.parse(packageContent);
      return {
        data,
        dir,
        get name() {
          return data.name;
        },
        get hasExports() {
          return Boolean(data.exports);
        },
      };
    }
  }

  async function readSubPackages(dir) {
    const stat = await fs.stat(dir).catch(() => void 0);

    if (!stat || !stat.isDirectory()) {
      return;
    }

    const dirnames = await fs.readdir(dir);
    const result = await Promise.all(dirnames.map((name) => readPackage(path.join(dir, name))));

    return result;
  }

  for (const item of packageConfigs) {
    const data = item.isSubPackage
      ? await readSubPackages(item.dirPath)
      : await readPackage(item.dirPath);

    if (data) {
      if (Array.isArray(data)) {
        packages.push(...data);
      } else {
        packages.push(data);
      }
    }
  }

  return packages;
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

  paths["@xiao-ai/utils/*"] = ["./node_modules/@xiao-ai/utils/dist/types/*"];

  for (const data of packages) {
    if (data.hasExports) {
      paths[`${data.name}/*`] = [`${path.relative(__dirname, data.dir).replace(/[\\/]/g, '/')}/src/*`];
    }
  }

  await fs.writeFile(path.join(__dirname, 'tsconfig.relative.json'), JSON.stringify(baseConfig, null, 2));
}

async function main() {
  const rootPath = await getRootPath();
  const packages = await getPackages(rootPath);

  await writeTsConfig(packages);

  console.log(' > Build Complete.')
}

main();
