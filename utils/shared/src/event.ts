/** 事件状态 */
export enum EventStatus {
  /** 创建请求 */
  Created,
  /** 正常返回 */
  Ok,
  /** 服务器运行错误 */
  ServerError,
  /** 未识别的请求 */
  NotFound,
}

/** 事件交换数据格式 */
export interface EventData<T = any> {
  $$id: number;
  data: T;
  name: string;
  status: EventStatus;
  error?: string;
}
