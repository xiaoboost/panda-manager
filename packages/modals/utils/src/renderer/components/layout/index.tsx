import React from 'react';

import { styles } from './style';
import { PropsWithChildren } from 'react';
import { stringifyClass as cln } from '@xiao-ai/utils';
import { CloseOutlined } from '@ant-design/icons';

export interface LayoutProps {
  className?: string;
  style?: React.CSSProperties;
  title: string;
  onOk?(): void;
  onCancel?(): void;
}

export function Layout({
  className,
  style,
  title,
  children,
  onOk,
  onCancel,
}: PropsWithChildren<LayoutProps>) {
  const { classes: cla } = styles;

  return (
    <main className={cln(className, cla.layout)} style={style}>
      <header className={cla.header}>
        {title}
        <CloseOutlined className={cla.headerIcon} onClick={onCancel} />
      </header>
      <article className={cla.article}>{children}</article>
      <footer className={cla.footer}>确定 取消</footer>
    </main>
  );
}
