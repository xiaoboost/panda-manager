import React from 'react';

import { style } from './style';
import { PropsWithChildren } from 'react';
import { EmptyObject, stringifyClass } from '@xiao-ai/utils';

interface CardProps {
  title: string;
}

export function Card(props: PropsWithChildren<CardProps>) {
  return <section className={style.classes.card}>
    <header className={style.classes.cardTitle}>{props.title}</header>
    <article className={style.classes.cardContent}>{props.children}</article>
  </section>;
}

interface CardLineProps {
  title: string;
  subtitle?: string;
  isSubLine?: boolean;
}

/** 选项卡片元素 */
export function CardLine(props: PropsWithChildren<CardLineProps>) {
  const {
    title,
    subtitle,
    isSubLine = false,
    children,
  } = props;

  return (
    <div
      className={stringifyClass(style.classes.baseBox, style.classes.baseLine, {
        [style.classes.line]: !isSubLine,
        [style.classes.subLine]: isSubLine,
      })}
    >
      <span>
        <div className={style.classes.lineName}>{title}</div>
        { subtitle && <div className={style.classes.lineSubName}>{subtitle}</div>}
      </span>
      {children}
    </div>
  );
}

export function CardBox({ children }: PropsWithChildren<EmptyObject>) {
  return <div className={style.classes.baseBox}>
    {children}
  </div>;
}
