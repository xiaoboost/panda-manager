export const Name = '_server_event';

/** 事件状态 */
export enum Status {
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
export interface Data<T = any> {
  id: number;
  data: T;
  name: string;
  status: Status;
  error?: string;
}
