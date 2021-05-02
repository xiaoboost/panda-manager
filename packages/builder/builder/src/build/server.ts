import { BuildProcess, BuildOptions } from './process';
import { isArray } from '@panda/utils';

export class BuildServer {
  /** 子进程 */
  readonly processes: BuildProcess[] = [];

  constructor(opts: BuildOptions | BuildOptions[]) {
    const options = isArray(opts) ? opts : [opts];
    this.processes = options.map((opt) => new BuildProcess(opt));
  }

  /** 输出日志 */
  print() {
    const logData = this.processes.map((item) => {
      return {
        name: item.name,
        log: item.log,
      };
    });

    console.log(logData);
    debugger;
  }

  /** 构建 */
  build() {
    return Promise.all(this.processes.map((item) => item.build()))
  }

  /** 调试 */
  watch() {
    this.processes.map((item) => {
      item.onLogChange(() => this.print());
      item.watch();
    });
  }
}
