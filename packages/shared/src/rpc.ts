/** 事件描述 */
export enum Description {
  /** 渲染进程到主进程 */
  ToMain = '_event_to_main',
  /** 主进程回复渲染进程通信 */
  ReplyRenderer = '_event_reply_renderer',
  /** 主进程向渲染进程广播事件 */
  BroadcastRenderer = '_event_broadcast_renderer',
}

/** 事件名称 */
export enum Name {
  /** 数据是否准备好 */
  Ready,
  /** 获取配置数据 */
  GetConfig,
  /** 更新配置数据 */
  PatchConfig,
  /** 获取文件列表 */
  GetFilesList,
  /** 获取文件详情 */
  GetFileDetail,
  /** 在资源浏览器中打开文件 */
  OpenFileInShell,
}

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
  /** 事件编号 */
  eventId: number;
  /** 渲染进程编号 */
  rendererId: number;
  /** 事件名称 */
  name: Name;
  /** 请求状态 */
  status: Status;
  /** 请求/返回数据 */
  data: T;
  /** 错误信息 */
  error?: string;
}
