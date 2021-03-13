import {
  spawn,
  SpawnOptionsWithoutStdio,
  ChildProcessWithoutNullStreams,
} from 'child_process';

import { EventEmitter } from 'events';

/** 子进程控制 */
export class Child extends EventEmitter {
  /** 子进程 */
  task: ChildProcessWithoutNullStreams;
  /** 输出日志 */
  stdout = '';
  /** 错误日志 */
  stderr = '';

  constructor(args: string[], options: SpawnOptionsWithoutStdio = {}) {
    super();
    this.task = spawn(args[0], args.slice(1), options);
    this.bindOutput('stdout');
    this.bindOutput('stderr');
  }

  bindOutput(name: 'stdout' | 'stderr') {
    this.task[name].on('data', (data) => {
      if (!Buffer.isBuffer(data)) {
        return;
      }

      // 清空日志
      if (data.length === 2 && data[0] === 27 && data[1] === 99) {
        this.stdout = '';
        this.stderr = '';
      }
      else {
        this[name] += data.toString();
      }
      
      this.emit(name === 'stdout' ? 'log' : 'error-log', this[name]);
    });
  }
}
