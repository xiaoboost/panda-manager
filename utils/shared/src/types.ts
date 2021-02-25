/** 事件交换数据格式 */
export interface EventData<T = undefined> {
  data: T;
  $$id: number;
  name: string;
  error?: string;
}
