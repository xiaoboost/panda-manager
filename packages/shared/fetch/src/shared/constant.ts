/** 渲染进程到主进程 */
export const FetchEventName = '_event_fetch_service';
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

/** 请求服务名称 */
export enum ServiceName {
  // 状态
  /** 初始化完成 */
  Ready = 100,
  /** 构建信息 */
  GetBuildInfo,

  // 配置
  /** 获取配置数据 */
  GetConfig = 200,
  /** 更新配置数据 */
  PatchConfig,

  // 项目数据
  /** 获取项目列表 */
  GetItemsList = 300,
  /** 获取项目详情 */
  GetItemDetail,

  // 标签
  /** 获取所有标签数据 */
  GetAllTags = 400,
  /** 新增标签 */
  AddTag,
  /** 新增标签集 */
  AddTagGroup,
  /** 修改标签 */
  PatchTag,
  /** 修改标签集 */
  PatchTagGroup,
  /** 修改标签元数据 */
  PatchTagMeta,
  /** 修改标签集元数据 */
  PatchTagGroupMeta,
  /** 移动标签 */
  MoveTag,
  /** 删除标签 */
  DeleteTag,
  /** 删除标签集 */
  DeleteTagGroup,
}
