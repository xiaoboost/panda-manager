// export { cli } from './process';

// import './test';

import { BuildServer } from './build';
import { join } from 'path';

const resolve = (...paths: string[]) => join(__dirname, '..', ...paths);

export function cli() {
  const builder = new BuildServer([
    {
      name: 'test',
      entryPoints: [resolve('src/files.ts')],
      outfile: resolve('dist/files.js'),
      logLevel: 'info',
      bundle: false,
    },
  ]);

  builder.watch();
}
