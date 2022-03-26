import type { DeepReadonlyArray } from '@xiao-ai/utils';

/** 搜索运算 */
export enum SearchOperation {
  Plus,
  Minus,
}

/** 搜索项类型 */
export enum SearchKind {
  /** 匹配文本 */
  Text,
  /** 匹配标签 */
  Tag,
}

/** 文本项 */
export type SearchOption =
  | {
      kind: SearchKind.Text;
      operation: SearchOperation;
      text: string;
    }
  | {
      kind: SearchKind.Tag;
      operation: SearchOperation;
      tag: number;
    };

/** 搜索待选项 */
export interface SearchItemData {
  tags: number[];
  text: string;
}

/** 根据选项判断是否匹配 */
export function match(data: SearchItemData, options: SearchOption[]) {
  return options.every((item) => {
    if (item.kind === SearchKind.Text) {
      if (item.operation === SearchOperation.Plus) {
        return data.text.includes(item.text);
      } else {
        return !data.text.includes(item.text);
      }
    } else {
      if (item.operation === SearchOperation.Plus) {
        return data.tags.includes(item.tag);
      } else {
        return !data.tags.includes(item.tag);
      }
    }
  });
}
