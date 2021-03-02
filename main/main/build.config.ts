import { BuildOptions } from '@panda/build';

export default (): BuildOptions => ({
  entryPoints: ['./src/index.ts'],
  outfile: 'dist/index.js',
  platform: 'node',
});
