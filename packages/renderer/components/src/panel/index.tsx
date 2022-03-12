import React from 'react';
import ReactDom from 'react-dom';

import { useBlur } from '@panda/renderer-utils';
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
  /** 阻止所有冒泡事件 */
  stopPropagation?: boolean;
  /** 可见性变更 */
  onBlur?(): void;
}

export function Panel({
  visible = false,
  x = 0,
  y = 0,
  stopPropagation = false,
  onBlur = () => void 0,
  children,
}: PropsWithChildren<PanelProps>) {
  const ref = useBlur<HTMLDivElement>(visible, () => onBlur());
  const stop = stopPropagation
    ? (ev: React.MouseEvent) => {
        ev.stopPropagation();
      }
    : undefined;

  if (!visible) {
    return ReactDom.createPortal(null, panelContainer);
  }

  return ReactDom.createPortal(
    <div className={style.classes.panel} onClick={stop} style={{ left: x, top: y }} ref={ref}>
      {children}
    </div>,
    panelContainer,
  );
}
