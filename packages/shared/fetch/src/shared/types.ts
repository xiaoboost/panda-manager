import { Status, ServiceName, BroadcastName } from './constant';

/** 前端请求数据格式 */
export interface FetchData<T = any> {
  /** 事件名称 */
  name: ServiceName;
  /** 事件编号 */
  eventId: number;
  /** 请求状态 */
  status: Status;
  /** 请求/返回数据 */
  data: T;
  /** 错误信息 */
  error?: string;
}

/** 进度事件 */
export interface ProgressData {
  /** 事件名称 */
  name: ServiceName;
  /** 事件编号 */
  eventId: number;
  /** 进度数值 */
  progress: number;
  /** 附加信息 */
  meta?: any;
}

/** 广播事件 */
export interface BroadcastData<T = any> {
  /** 事件名称 */
  name: BroadcastName;
  /** 广播数据 */
  data: T;
}
