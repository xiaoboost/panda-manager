import { defineConfig } from '@panda/builder';

export default defineConfig({
  entry: './src/index.ts',
  process: 'preload',
  output: 'preload',
});
