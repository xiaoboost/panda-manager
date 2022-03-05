import React from 'react';

import { style } from './style';
import { stringifyClass } from '@xiao-ai/utils';
import { Panel } from '@panda/components';
import { useState, useRef, PropsWithChildren } from 'react';

export interface MenuProps {
  title: React.ReactNode;
  className?: string;
  highlightClassName?: string;
}

/** 获取元素相对于屏幕的位置 */
function getOffset(el: HTMLElement): [number, number] {
  let left = 0;
  let top = 0;
  let current: HTMLElement | null = el;

  while (current) {
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return [left, top];
}

export function MenuNav(props: PropsWithChildren<MenuProps>) {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState<[number, number]>();
  const onClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();

    const { current: el } = ref;

    if (!el) {
      return;
    }

    const offset = getOffset(el);

    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosition([offset[0], offset[1] + el.offsetHeight]);
    }
  };

  return (
    <span
      ref={ref}
      className={stringifyClass(style.classes.nav, props.className, {
        [props.highlightClassName ?? '']: Boolean(props.highlightClassName && show),
      })}
      onClick={onClick}
    >
      {props.title}
      {props.children && (
        <Panel visible={show} x={position?.[0]} y={position?.[1]} onVisibleChange={setShow}>
          {props.children}
        </Panel>
      )}
    </span>
  );
}
