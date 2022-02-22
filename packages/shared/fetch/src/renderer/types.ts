import { FetchData } from '../shared';
import { ServiceName } from '@panda/shared';

export interface FetchParam {
  /** 事件名称 */
  name: ServiceName;
  /** 参数 */
  params?: any;
  /**
   * 进度回调
   *   - `progress`为 0 ~ 100
   */
  onProgress?(progress: number): void;
}

export interface FetchStore extends FetchParam {
  /** 当前事件编号 */
  eventId: number;
  /** 异步事件触发器 */
  resolve(data: FetchData): void;
}
