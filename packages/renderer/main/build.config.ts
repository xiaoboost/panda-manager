import { defineConfig } from '@panda/builder';

export default defineConfig({
  entry: 'src/init/index.ts',
  process: 'renderer',
  output: 'views/main',
  html: 'src/index.html',
});
