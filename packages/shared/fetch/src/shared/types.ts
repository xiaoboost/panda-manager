import { Status } from './constant';
import { ServiceName } from '@panda/shared';

/** 事件基础数据 */
interface BaseData<T> {
  /** 事件编号 */
  eventId: number;
  /** 请求状态 */
  status: Status;
  /** 请求/返回数据 */
  data: T;
  /** 错误信息 */
  error?: string;
}

/** 前端请求数据格式 */
export interface FetchData<T = any> extends BaseData<T> {
  /** 事件名称 */
  name: ServiceName;
}

/** 进度事件 */
export interface ProgressData {
  /** 事件名称 */
  name: ServiceName;
  /** 事件编号 */
  eventId: number;
  /** 进度数值 */
  progress: number;
}
