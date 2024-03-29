import { FetchData, ServiceName } from '../shared';

export interface FetchParam<P = any> {
  /** 事件名称 */
  name: ServiceName;
  /** 参数 */
  params?: P;
  /**
   * 进度回调
   *   - `progress`为 0 ~ 100
   */
  onProgress?(progress: number, meta: any): void;
}

export interface FetchStore extends FetchParam {
  /** 当前事件编号 */
  eventId: number;
  /** 异步事件触发器 */
  resolve(data: FetchData): void;
  /** 异步事件错误触发器 */
  reject(data: Error): void;
}
