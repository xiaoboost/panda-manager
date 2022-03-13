import React from 'react';
import ReactDom from 'react-dom';

import { stringifyClass as cla } from '@xiao-ai/utils';
import { useBlur } from '@panda/renderer-utils';
import { PropsWithChildren } from 'react';
import { panelContainer } from './store';
import { style } from './style';

export * from './split';
export * from './item';

export interface PanelProps {
  /** 面板类名 */
  className?: string;
  /** 是否可见 */
  visible?: boolean;
  /** 面板宽度 */
  width?: number;
  /** 如果可见，面板原点的横坐标 */
  x?: number;
  /** 如果可见，面板原点的纵坐标 */
  y?: number;
  /** 绑定的元素 */
  renderElement?: HTMLElement;
  /** 阻止所有冒泡事件 */
  stopPropagation?: boolean;
  /** 失去焦点回调 */
  onBlur?(): void;
  /** 点击事件回调 */
  onClick?(ev: React.MouseEvent): void;
}

export function Panel({
  visible = false,
  x = 0,
  y = 0,
  width = 180,
  className,
  renderElement,
  stopPropagation = false,
  onBlur = () => void 0,
  onClick,
  children,
}: PropsWithChildren<PanelProps>) {
  const portalEl = renderElement ?? panelContainer;
  const ref = useBlur<HTMLDivElement>(visible, onBlur);
  const clickHandler = stopPropagation
    ? (ev: React.MouseEvent) => {
        ev.stopPropagation();
        onClick?.(ev);
      }
    : onClick;

  if (!visible) {
    return ReactDom.createPortal(null, portalEl);
  }

  return ReactDom.createPortal(
    <div
      className={cla(style.classes.panel, className)}
      onClick={clickHandler}
      style={{ left: x, top: y, width }}
      ref={ref}
    >
      {children}
    </div>,
    portalEl,
  );
}
