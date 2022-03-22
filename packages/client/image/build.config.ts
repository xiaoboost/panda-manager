import { defineConfig } from '@panda/builder';

export default defineConfig({
  entry: 'src/compress.worker.ts',
  process: 'main',
  output: 'worker/image',
});
