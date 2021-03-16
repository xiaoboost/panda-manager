  
import * as path from 'path';
import * as fs from '@panda/fs';

import type { Plugin } from 'esbuild';
import type { Options } from './types';

import { toCss } from './to-css';

export function stylusLoader(options: Options = {}): Plugin {
  return {
    name: 'stylus-loader',
    setup(build) {
      build.onResolve({filter: /\.styl$/}, args => ({
        path: path.resolve(
          process.cwd(),
          path.relative(process.cwd(), args.resolveDir),
          args.path,
        ),
        namespace: 'stylus',
      }))

      build.onLoad({filter: /.*/, namespace: 'stylus', }, async (args) => {
        const content = await fs.readFile(args.path, 'utf-8');
        const code = await toCss(args.path, content, options);

        return {
          contents: code,
          loader: 'css',
        }
      })
    },
  }
}