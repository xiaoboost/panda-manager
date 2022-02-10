/** 事件描述 */
export enum Description {
  /** 渲染进程到主进程 */
  Main = '_to_main_event',
  /** 主进程回复渲染进程通信 */
  ReplyRenderer = '_to_renderer_event',
  /** 主进程向渲染进程广播事件 */
  broadcastRenderer = '_to_renderer_event',
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
  id: number;
  data: T;
  name: Name;
  status: Status;
  error?: string;
}
