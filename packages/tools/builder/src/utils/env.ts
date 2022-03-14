import fs from 'fs-extra';
import path from 'path';

function parseNpmRc(content: string) {
  const result: Record<string, string> = {};

  content
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const [key, value] = item.split('=').map((item) => item.trim());

      if (key && value) {
        result[key] = value;
      }
    });

  return result;
}

export function getResolve(...base: string[]) {
  return function resolve(...paths: (string | number)[]) {
    return path.join(...base, ...paths.map(String)).replace(/\\/g, '/');
  };
}

/** 从命令运行路径开始 */
export const resolveCWD = getResolve(process.cwd());
/** 从库自身根路径开始 */
export const resolveBuilder = getResolve(__dirname, '../../');
/** 应用元信息 */
export const appData = fs.readJSONSync(resolveCWD('package.json'));
/** 当前环境变量 */
export const npmEnv = parseNpmRc(fs.readFileSync(resolveCWD('.npmrc'), 'utf-8'));
