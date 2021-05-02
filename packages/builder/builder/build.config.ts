import { BuildOptions } from '@panda/builder';

export default (): BuildOptions => ({
  entryPoints: ['./src/index.ts'],
  outfile: 'dist/index.js',
  platform: 'node',
  format: 'cjs',
  external: ['esbuild', 'react', 'ink', '@panda/esbuild-plugin-stylus']
});
