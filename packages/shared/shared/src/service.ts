/** 请求服务名称 */
export enum ServiceName {
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
  /** 打开“关于”对话框 */
  OpenAboutModal,
  /** 以桌面的默认方式打开文件 */
  OpenPathDefaultManner,
  /** 打开选择文件（夹）对话框 */
  OpenSelectDialog,
}
