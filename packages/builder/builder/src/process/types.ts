import type { CopyProcess } from './copy';
import type { PackageProcess } from './package';
import type { EsbuildProcess } from './esbuild';

export interface FileData {
  path: string;
  content: Buffer;
}

export interface Process {
  /** 进程名称 */
  name: string;
  /** 进程选项 */
  options: any;
  /** 当前文件输出 */
  files: FileData[];
  /** 当前日志 */
  log: string;
  /** 状态变更钩子 */
  onChange(): any;
  /** 构建 */
  build(): any;
  /** 监听 */
  watch(): any;
}

export interface ProcessOption {
  name: string;
  options: any;
  type: |
  (typeof CopyProcess)['type'] |
  (typeof PackageProcess)['type'] |
  (typeof EsbuildProcess)['type'];
}

export type ChangeEvent = () => any;
