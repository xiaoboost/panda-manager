export const SendInitDataEventName = '_modal_init_event';
export const ResolveEventName = '_modal_resolve_event';

export interface ExchangeData<T = any> {
  /** 表单数据 */
  formData: T;
  /**
   * 用户点击
   *  - `true` 表示点确定
   *  - `false` 表示点取消
   */
  button: boolean;
}
