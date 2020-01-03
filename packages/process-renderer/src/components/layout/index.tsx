import styles from './index.less';

import { default as React, PropsWithChildren } from 'react';

import { Header } from '../header';
import { Sidebar } from '../sidebar';

export const Layout = ({ children }: PropsWithChildren<{}>) => (
    <div className={styles.app}>
        <Header />
        <article className={styles.appBody}>
            <Sidebar />
            <div className={styles.appContentWrapper}>
                {children}
            </div>
        </article>
    </div>
);
