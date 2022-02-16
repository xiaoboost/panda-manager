// import './index.less';

import React from 'react';

// import { Header } from '../header';
// import { Sidebar } from '../sidebar';

import { PropsWithChildren } from 'react';
import { useIsFocus } from '@panda/renderer-utils';
import { stringifyClass, EmptyObjectStrict } from '@xiao-ai/utils';

export function Layout({ children }: PropsWithChildren<EmptyObjectStrict>) {
  const isFocus = useIsFocus();

  return (
    <div
      className={stringifyClass('app', {
        '.app-unFocus': !isFocus,
      })}
    >
      <article className='app-body'>
        <div className='app-content__wrapper'>{children}</div>
      </article>
    </div>
  );
}
