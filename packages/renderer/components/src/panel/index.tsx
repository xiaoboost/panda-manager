import React from 'react';
import ReactDom from 'react-dom';

import { useClickOutside } from '@panda/renderer-utils';
import { PropsWithChildren } from 'react';
import { panelContainer } from './store';
import { style } from './style';

export * from './split';
export * from './item';

export interface PanelProps {
  /** 是否可见 */
  visible?: boolean;
  /** 如果可见，面板原点的横坐标 */
  x?: number;
  /** 如果可见，面板原点的纵坐标 */
  y?: number;
  /** 可见性变更 */
  onBlur?(): void;
}

export function Panel(props: PropsWithChildren<PanelProps>) {
  const { visible = false, x = 0, y = 0, onBlur = () => void 0, children } = props;
  const ref = useClickOutside<HTMLDivElement>(() => onBlur());

  if (!visible) {
    return ReactDom.createPortal(null, panelContainer);
  }

  return ReactDom.createPortal(
    <div className={style.classes.panel} style={{ left: x, top: y }} ref={ref}>
      {children}
    </div>,
    panelContainer,
  );
}
