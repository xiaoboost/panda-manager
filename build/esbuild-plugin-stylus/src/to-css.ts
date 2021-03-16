import stylus from 'stylus';

import { Options } from './types'

export function toCss(fileName: string, content: string, options: Options) {
  return new Promise<string>((resolve, reject) => {
    const styl = stylus(content)

    styl.set('filename', fileName)

    if (options.sourcemap) {
      styl.set('sourcemap', {
        inline: true,
      });
    }

    if (options.use) {
      options.use.forEach(usage => {
        styl.use(usage);
      });
    }

    if (options.import) {
      options.import.forEach(file => {
        styl.import(file);
      });
    }

    if (options.include) {
      options.include.forEach(include => {
        styl.include(include);
      });
    }

    if (options.define) {
      options.define.forEach(define => {
        styl.define(define[0], define[1]);
      });
    }

    styl.render((err, css) => {
      if (err) {
        return reject(err);
      }

      resolve(css);
    });
  });
}