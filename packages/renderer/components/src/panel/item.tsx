import React from 'react';

import { style } from './style';
import { stringifyClass } from '@xiao-ai/utils';
import { PropsWithChildren } from 'react';

export interface PanelItemProps {
  shortcut?: string;
  disabled?: boolean;
  onClick?(): void;
}

export function PanelItem(props: PropsWithChildren<PanelItemProps>) {
  return (
    <div
      className={stringifyClass(style.classes.item, {
        [style.classes.disabled]: props.disabled ?? false,
      })}
      onClick={props.onClick}
    >
      <span>{props.children}</span>
      {props.shortcut && <span>{props.shortcut}</span>}
    </div>
  );
}
