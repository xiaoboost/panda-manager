import React from 'react';

import { PropsWithChildren } from 'react';

export interface LayoutProps {
  title: string;
  onOk?(): void;
  onCancel?(): void;
}

export function Layout({ title, children, onOk, onCancel }: PropsWithChildren<LayoutProps>) {
  return (
    <main>
      <header>标题</header>
      <article>{children}</article>
      <footer>确定 取消</footer>
    </main>
  );
}
