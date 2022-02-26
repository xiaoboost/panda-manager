/** 渲染进程到主进程 */
export const FetchEventName = '_event_fetch_event';
/** 主进程回复渲染进程通信 */
export const ReplyEventName = '_event_fetch_reply_renderer';
/** 主进程回复渲染进程进度事件通信 */
export const ProgressEventName = '_event_fetch_progress_renderer';

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
