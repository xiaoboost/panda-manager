/** 事件描述 */
export enum Description {
  /** 渲染进程到主进程 */
  ToMain = '_event_to_main',
  /** 主进程回复渲染进程通信 */
  ReplyRenderer = '_event_reply_renderer',
  /** 主进程向渲染进程广播事件 */
  BroadcastRenderer = '_event_broadcast_renderer',
}

/** 前端请求事件名称 */
export enum FetchName {
  // 窗口状态
  /** 窗口是否在焦点 */
  IsFocused = 100,
  /** 窗口是否最大化 */
  IsMaximized,
  /** 窗口是否最小化 */
  IsMinimized,
  /** 获取窗口编号 */
  GetWindowId,

  // 后台服务
  /** 数据是否准备好 */
  Ready = 200,
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

/** 后端广播事件名称 */
export enum BroadcastName {
  /** 窗口获得焦点 */
  Focus,
  /** 窗口失去焦点 */
  Blur,
  /** 窗口最大化 */
  Maximize,
  /** 窗口最小化 */
  Unmaximize,
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

/** 事件基础数据 */
interface BaseData<T> {
  /** 事件编号 */
  eventId: number;
  /** 渲染进程编号 */
  rendererId: number;
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
  name: FetchName;
}

/** 后端广播数据格式 */
export interface BroadcastData <T = any> extends BaseData<T> {
  /** 事件名称 */
  name: BroadcastName;
}
