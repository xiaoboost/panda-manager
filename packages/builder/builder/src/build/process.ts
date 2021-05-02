import { parentPort, Worker } from 'worker_threads';
import {
  build as esbuild,
  formatMessages,
  BuildOptions as EsBuildOptions,
  OutputFile,
  BuildFailure,
} from 'esbuild';

export interface BuildOptions extends Omit<EsBuildOptions, 'watch'> {
  name: string;
}

export type LogEvent = (log: string) => any;

/** 全局进程编号 */
let id = 0;

/** 传去子进程的事件接口 */
interface ToSubMessageEvent {
  id: number;
  name: 'build' | 'watch';
  value: EsBuildOptions;
}

/** 传回主进程的事件接口 */
interface ToMainMessageEvent {
  id: number;
  name: 'log' | 'buildEnd';
  value: any;
}

export class BuildProcess {
  /** 当前进程编号 */
  private readonly id = id++;
  /** 编译选项 */
  private options: EsBuildOptions;
  /** log 事件数据 */
  private logEvents: LogEvent[] = [];
  /** 子进程 */
  private worker: Worker;
  /** 构建项目名称 */
  readonly name: string;

  /** 当前日志 */
  log = '';
  /** 当前构建的文件 */
  files: OutputFile[] = [];

  constructor({ name, ...options }: BuildOptions) {
    this.options = options;
    this.name = name;
    this.worker = new Worker(__filename);
  }

  /** 触发 log 变更事件 */
  private emitLogEvent() {
    debugger;
    this.logEvents.forEach((cb) => cb(this.log));
  }

  /** 子进程发出指令 */
  private postMessage(
    name: ToSubMessageEvent['name'],
    value: any,
  ) {
    return new Promise<void>((resolve) => {
      const postData: ToSubMessageEvent = {
        name,
        value,
        id: this.id,
      };

      this.worker.postMessage(postData);

      this.worker.on('message', (data: ToMainMessageEvent) => {
        debugger;
        if (data.id !== this.id) {
          return;
        }
        else if (data.name === 'buildEnd') {
          this.files = data.value;
          resolve();
          return;
        }
        else if (data.name === 'log') {
          this.log = data.value;
          this.emitLogEvent();
          return;
        }
      });
    });
  }

  /** 启动构建 */
  async build() {
    await this.postMessage('build', this.options);
    await this.worker.terminate();
  }

  /** 启动监听构建 */
  async watch() {
    await this.postMessage('watch', this.options);
  }

  /** 注册 log 事件 */
  onLogChange(cb: LogEvent) {
    this.logEvents.push(cb);
  }
}

if (parentPort) {
  parentPort.on('message', async (data: ToSubMessageEvent) => {
    const getLog = async (result: BuildFailure) => {
      let log = '';

      if (result.errors) {
        log += (await formatMessages(result.errors, {
          kind: 'error',
        })).join('\n\n');
      }

      if (result.warnings) {
        log += (await formatMessages(result.warnings, {
          kind: 'warning',
        })).join('\n\n');
      }

      return log;
    };

    const returnLog = (log: string) => {
      if (log.length === 0) {
        return;
      }

      const logData: ToMainMessageEvent = {
        id: data.id,
        name: 'log',
        value: log,
      };

      parentPort!.postMessage(logData);
    };

    const returnFiles = (files: OutputFile[]) => {
      const fileData: ToMainMessageEvent = {
        id: data.id,
        name: 'buildEnd',
        value: files,
      };

      parentPort!.postMessage(fileData);
    };

    data.value.write = false;

    if (data.name === 'build') {
      data.value.watch = false;

      const result = await esbuild(data.value).catch((e) => e);
      const log = await getLog(result);

      returnLog(log);
      returnFiles(result.outputFiles);
    }
    else if (data.name === 'watch') {
      data.value.watch = false;

      await esbuild({
        ...data.value,
        watch: {
          onRebuild: async (err, result) => {
            debugger;
            const log = err ? await getLog(err) : '';
            const files = result ? result.outputFiles ?? [] : [];

            returnLog(log);
            returnFiles(files);
          },
        },
      });
    }
  });
}
