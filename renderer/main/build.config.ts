import { BuildOptions, ConfigContext } from '@panda/builder';
import { lessLoader } from 'esbuild-plugin-less';

export default ({ env }: ConfigContext): BuildOptions => {
  return {
    entryPoints: ['./src/init/index.ts'],
    platform: 'browser',
    outdir: 'dist',
    sourcemap: env.isDevelopment,
    tsconfig: './tsconfig.build.json',
    plugins: [lessLoader()],
  };
};
