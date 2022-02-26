import yargs from 'yargs';

import { build } from './build';
import { watch } from './watch';
import { generate } from './package';

function setYargsCommand(yargs: yargs.Argv<any>) {
  return yargs.options({
    outDir: {
      type: 'string',
      describe: '输出文件夹',
      require: true,
    },
    watch: {
      type: 'boolean',
      describe: '监听项目',
      default: false,
    },
    mode: {
      type: 'string',
      describe: '构建模式',
      choices: ['development', 'production'],
      default: 'development',
    },
    bundleAnalyze: {
      type: 'boolean',
      describe: '分析包构成，只有当 mode 为 production 时才有效',
      default: false,
    },
  });
}

export function run() {
  yargs
    .command(
      ['build'],
      'build',
      yargs => setYargsCommand(yargs),
      argv => build(argv),
    )
    .command(
      ['watch'],
      'watch',
      yargs => setYargsCommand(yargs),
      argv => watch(argv),
    )
    .command(
      ['package'],
      'package',
      yargs => yargs.options({
        output: {
          type: 'string',
          describe: '输出路径',
          require: true,
        },
        input: {
          type: 'string',
          describe: '打包路径',
          require: true,
        },
      }),
      argv => generate(argv),
    )
    .strict()
    .showHelpOnFail(false).argv;
}
