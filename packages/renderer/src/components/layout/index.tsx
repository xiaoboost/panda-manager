import React from 'react';
import styles from './index.styl';

import { Header } from '../header';
import { Sidebar } from '../sidebar';

import { PropsWithChildren } from 'react';
import { stringifyClass } from '@panda/utils';
import { useIsFocus } from '@panda/use';

export function Layout({ children }: PropsWithChildren<{}>) {
  const isFocus = useIsFocus();

  return (
    <div
      className={stringifyClass(styles.app, {
        [styles.appUnfocus]: !isFocus,
      })}
    >
      <Header />
      <article className={styles.appBody}>
        <Sidebar />
        <div className={styles.appContentWrapper}>{children}</div>
      </article>
    </div>
  );
}
