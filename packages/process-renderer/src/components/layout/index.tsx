import React from 'react';
import styles from './index.less';

import { Header } from '../header';
import { Sidebar } from '../sidebar';

import { useIsFocus } from '@utils/react-use';
import { stringifyClass } from '@utils/web';
import { PropsWithChildren } from 'react';

export function Layout({ children }: PropsWithChildren<{}>) {
    const isFocus = useIsFocus();

    // const [loading] = usePromiseState(ready);

    // if (loading) {
    //     return <div className={styles.app}>
    //         <div className={styles.appLoading}>
    //             <LoadingOutlined />
    //         </div>
    //     </div>;
    // }

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
