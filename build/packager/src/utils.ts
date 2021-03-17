import * as path from 'path';

export const isDevelopment = process.argv.includes('--development');
export const isProduction = !isDevelopment && process.argv.includes('--production');
export const isWatch = process.argv.includes('--watch');

const projectRoot = process.cwd();

export function resolve(...paths: string[]) {
  return path.join(projectRoot, ...paths);
}

const mappings = [
  ['renderer/main/src/init', 'views/renderer'],
  ['renderer/main/src', 'views/renderer'],
  ['renderer/preload/src', 'views/preload'],
  ['main/main/src', 'main'],
].map(([key, value]) => ([
  path.normalize(key),
  value,
]));

export function pathMapping(origin: string) {
  const fsOrigin = path.normalize(origin);

  for (const [map, mapped] of mappings) {
    if (fsOrigin.includes(map)) {
      const [before, after] = fsOrigin.split(map);
      return path.join(before, mapped, after);
    }
  }

  return fsOrigin;
}

export const outputDir = resolve('dist/generated');
