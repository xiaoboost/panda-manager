import './index.less';

import React from 'react';

// import { Header } from '../header';
// import { Sidebar } from '../sidebar';

import { PropsWithChildren } from 'react';
import { useIsFocus } from '@panda/use';
import { stringifyClass, Empty } from '@panda/utils';

export function Layout({ children }: PropsWithChildren<Empty>) {
  const isFocus = useIsFocus();

  return (
    <div
      className={stringifyClass('app', {
        '.app-unFocus': !isFocus,
      })}
    >
      {/* <Header /> */}
      <article className='app-body'>
        {/* <Sidebar /> */}
        <div className='app-content__wrapper'>{children}</div>
      </article>
    </div>
  );
}
