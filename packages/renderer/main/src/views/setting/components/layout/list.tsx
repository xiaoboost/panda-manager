import React from 'react';

export interface ListProps {
  /** 列表数据 */
  data: string[];
  // /** 禁用编辑 */
  // editDisabled?: boolean;
  // /** 禁用列表 */
  // disabled?: boolean;
  /** 为空时的文本 */
  placeholder?: string;
  /** 动作图标 */
  actionIcon?: React.ReactNode;
  /** 动作回调 */
  onAction?(val: string, index: number): void;
  // /** 编辑回调 */
  // onEdit?(val: string, index: number): void;
  /** 删除回调 */
  onDelete?(val: string, index: number): void;
  /** 新增回调 */
  onAdd?(): void;
}

export function List(props: ListProps) {
  return <div>list</div>;
}
