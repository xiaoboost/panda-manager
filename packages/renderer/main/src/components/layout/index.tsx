import React from 'react';

import { Header } from '../header';
// import { Sidebar } from '../sidebar';

import { style } from './style';
import { PropsWithChildren } from 'react';
import { useIsFocus } from '@panda/renderer-utils';
import { stringifyClass, EmptyObject } from '@xiao-ai/utils';

export function Layout({ children }: PropsWithChildren<EmptyObject>) {
  const isFocus = useIsFocus();

  return (
    <div
      className={stringifyClass(style.classes.app, {
        [style.classes.appUnFocus]: !isFocus,
      })}
    >
      <Header />
      <article className={style.classes.appBody}>
        {/* <Sidebar />  */}
        <div className={style.classes.appContent}>{children}</div>
      </article>
    </div>
  );
}
