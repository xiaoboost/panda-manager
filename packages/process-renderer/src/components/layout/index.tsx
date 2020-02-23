import React from 'react';
import styles from './index.less';

import { Header } from '../header';
import { Sidebar } from '../sidebar';

import { stringifyClass } from '@utils/web';
import { PropsWithChildren } from 'react';
import { useIsFocus, usePromiseState } from '@utils/react-use';

import { LoadingOutlined } from '@ant-design/icons';

import * as config from '@renderer/store/config';
import * as database from '@renderer/store/database';
import * as directory from '@renderer/store/directory';
import * as extension from '@renderer/store/extensions';

export function Layout({ children }: PropsWithChildren<{}>) {
    const isFocus = useIsFocus();
    const [loading] = usePromiseState(Promise.all([
        config.ready,
        database.ready,
        directory.ready,
        extension.ready,
    ]));

    // TODO: 等待页面
    if (loading) {
        return <div className={styles.app}>
            <div className={styles.appLoading}>
                <LoadingOutlined />
            </div>
        </div>;
    }

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
