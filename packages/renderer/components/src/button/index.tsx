import React from 'react';

import { PropsWithChildren } from 'react';
import { styles, getClassNameByType } from './style';
import { stringifyClass as cla } from '@xiao-ai/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { BaseProps } from '@panda/shared';

export interface ButtonProps extends BaseProps {
  /**
   * 设置按钮类型
   *   - `'normal'` 只有边框
   *   - `'primary'` 蓝色，默认值
   *   - `'danger'` 红色
   */
  type?: 'normal' | 'primary' | 'danger';
  // /** 禁用状态 */
  // disabled?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 点击事件 */
  onClick?(): void;
}

export function Button({
  className,
  style,
  type = 'primary',
  // disabled = false,
  loading = false,
  onClick,
  children,
}: PropsWithChildren<ButtonProps>) {
  const { classes } = styles;

  return (
    <span
      className={cla(classes.btnContainer, className, getClassNameByType(type))}
      style={style}
      onClick={onClick}
    >
      {loading && (
        <span className={classes.btnIcon}>
          <LoadingOutlined />
        </span>
      )}
      <span className={classes.btn}>{children}</span>
    </span>
  );
}
