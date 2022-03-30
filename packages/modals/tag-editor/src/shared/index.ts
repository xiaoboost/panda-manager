/** 表单数据 */
export interface FormData {
  /** 标签名称 */
  name: string;
  /** 注释说明 */
  comment: string;
  /** 标签别名 */
  alias: string[];
  /**
   * 属于哪个标签集
   *   - 当前为标签时有效
   */
  groupId?: number;
}

/** 外部数据 */
export interface InitData extends FormData {
  /** 对话框标题 */
  title: string;
}

/** 窗口宽 */
export const ModalWidth = 400;
/** 窗口高 */
export const ModalHeight = 300;
