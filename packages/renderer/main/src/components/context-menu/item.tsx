import React from 'react';

import { styles } from './style';
import { stringifyClass } from '@xiao-ai/utils';
import { PropsWithChildren } from 'react';

export interface MenuItemProps {
  shortcut?: string;
  disabled?: boolean;
  onClick?(): void;
}

export function MenuItem(props: PropsWithChildren<MenuItemProps>) {
  return (
    <div
      className={stringifyClass(styles.classes.item, {
        [styles.classes.disabled]: props.disabled ?? false,
      })}
      onClick={props.onClick}
    >
      <span>{props.children}</span>
      {props.shortcut && <span>{props.shortcut}</span>}
    </div>
  );
}
