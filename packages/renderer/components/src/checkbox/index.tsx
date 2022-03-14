import React from 'react';

import { PropsWithChildren } from 'react';

export interface CheckboxProps {
  /** 指定当前是否选中 */
  checked: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 变化时回调函数 */
  onChange?(val: boolean): void;
}

export function Checkbox({
  checked,
  disabled = false,
  children,
}: PropsWithChildren<CheckboxProps>) {
  return <div>{children}</div>;
}
