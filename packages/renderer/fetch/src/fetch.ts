import { ipcRenderer } from 'electron';
import { RPC } from '@panda/shared';

export interface FetchParam {
  /** 事件名称 */
  name: RPC.FetchName;
  /**
   * 进度回调
   *   - `progress`为 0 ~ 100
   */
  onProgress?(progress: number): void;
  /** 参数 */
  params?: any;
}

/** fetch 函数初始化 */
export function fetchInit() {
  // ..
}

export async function fetch<T = any>(param: FetchParam): T;
export async function fetch<T = any>(name: RPC.FetchName, params?: any): T;
export async function fetch<T = any>(name: RPC.FetchName | FetchParam, data?: any): T {
  ipcRenderer.send
}
