import React from 'react';

import { style } from './style';
import { useClickOutside } from '@panda/renderer-utils';
import { stringifyClass } from '@xiao-ai/utils';

import { useState, useRef, PropsWithChildren } from 'react';

export * from './panel';

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
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState<[number, number]>();
  const onClick = () => {
    const { current: el } = ref;

    if (!el) {
      return;
    }

    const offset = getOffset(el);

    if (show) {
      setShow(false);
    }
    else {
      setShow(true);
      setPosition([
        offset[0],
        offset[1] + el.offsetHeight,
      ]);
    }
  };

  useClickOutside(ref.current, () => setShow(false));

  return (
    <span
      ref={ref}
      className={stringifyClass(style.classes.menu, props.className, {
        [props.highlightClassName ?? '']: Boolean(props.highlightClassName && show),
      })}
      onClick={onClick}
    >
      {props.title}
      {props.children && (
        <div
          className={stringifyClass(style.classes.panel, {
            [style.classes.panelShow]: show,
          })}
          style={{
            left: position?.[0],
            top: position?.[1],
          }}
        >
          {props.children}
        </div>
      )}
    </span>
  )
}
