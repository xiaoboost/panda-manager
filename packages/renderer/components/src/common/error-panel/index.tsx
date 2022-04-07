import React from 'react';

import { Float } from '../../float';

import { styles } from './style';
import { errorContainer } from './store';
import { useState, useEffect } from 'react';
import { getOffset } from '@panda/renderer-utils';

export interface ErrorPanelProps {
  /** 绑定的元素 */
  targetRef: React.RefObject<HTMLElement>;
  /**
   * 错误信息
   *   - 为空时表示不显示此面板
   */
  message: string;
}

export function ErrorPanel({ targetRef, message }: ErrorPanelProps) {
  const [panelPosition, setPanelPosition] = useState([0, 0, 0]);

  useEffect(() => {
    if (message.length === 0) {
      setPanelPosition([-1e6, -1e6, -1e6]);
      return;
    }

    const { current: el } = targetRef;

    if (el) {
      const offset = getOffset(el);
      setPanelPosition([offset[0], offset[1] + el.offsetHeight, el.offsetWidth]);
    }
  }, [message, targetRef.current]);

  return (
    <Float
      visible={message.length > 0}
      x={panelPosition[0]}
      y={panelPosition[1]}
      width={panelPosition[2]}
      renderElement={errorContainer}
      className={styles.classes.panel}
    >
      {message}
    </Float>
  );
}
