import React from 'react';

import { style } from './style';
import { stringifyClass } from '@xiao-ai/utils';
import { Panel } from '@panda/components';
import { getOffset } from '@panda/renderer-utils';
import { useState, useRef, PropsWithChildren } from 'react';

export interface MenuProps {
  title: React.ReactNode;
  className?: string;
  highlightClassName?: string;
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
        <Panel visible={show} x={position?.[0]} y={position?.[1]} onBlur={() => setShow(false)}>
          {props.children}
        </Panel>
      )}
    </span>
  );
}
