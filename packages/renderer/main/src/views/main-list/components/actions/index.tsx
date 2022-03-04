import React from 'react';

import { style } from './style';
import { PropsWithChildren } from 'react';
import { stringifyClass } from '@xiao-ai/utils';
import { BaseProps } from '@panda/shared';

/** 按钮列表容器 */
export function Container(props: PropsWithChildren<BaseProps>) {
  return (
    <ul className={stringifyClass(style.classes.container, props.className)} style={props.style}>
      {props.children}
    </ul>
  );
}

interface ItemProps extends BaseProps {
  title: string;
}

/** 按钮容器 */
export function ActionItem(props: PropsWithChildren<ItemProps>) {
  return (
    <li className={stringifyClass(style.classes.item, props.className)} onClick={props.onClick}>
      <a className={style.classes.label} title={props.title}>
        {props.children}
      </a>
    </li>
  );
}
