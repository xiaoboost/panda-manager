import styles from './index.less';

import { default as React, PropsWithChildren } from 'react';

interface CardProps {
    title: string;
}

export default function Card(props: PropsWithChildren<CardProps>) {
    return (
        <section className={styles.settingSection}>
            <header className={styles.settingTitle}>{props.title}</header>
            <article className={styles.settingCard}>{props.children}</article>
        </section>
    );
}
