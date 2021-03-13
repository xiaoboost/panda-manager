import * as path from 'path';

export const isDevelopment = process.argv.includes('--development');
export const isProduction = !isDevelopment && process.argv.includes('--production');
export const isWatch = process.argv.includes('--watch');

const projectRoot = process.cwd();

export function resolve(...paths: string[]) {
  return path.join(projectRoot, ...paths);
}
