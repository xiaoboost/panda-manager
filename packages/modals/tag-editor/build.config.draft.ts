import { defineConfig } from '@panda/builder';

export default defineConfig({
  entry: 'src/renderer/index.ts',
  process: 'renderer',
  output: 'views/tag-editor',
  html: 'src/renderer/index.html',
});
