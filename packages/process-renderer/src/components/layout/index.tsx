import styles from './index.less';

import { default as React, PropsWithChildren } from 'react';

import { Header } from '../header';
import { Sidebar } from '../sidebar';

import { useIsFocus } from '@utils/react-use';
import { stringifyClass } from '@utils/web';

export function Layout({ children }: PropsWithChildren<{}>) {
    const isFocus = useIsFocus();

    return (
        <div
            className={stringifyClass(styles.app, {
                [styles.appUnfocus]: !isFocus,
            })}>
            <Header />
            <article className={styles.appBody}>
                <Sidebar />
                <div className={styles.appContentWrapper}>
                    {children}
                </div>
            </article>
        </div>
    );
}
