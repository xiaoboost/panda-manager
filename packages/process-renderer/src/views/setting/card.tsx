import styles from './index.less';

import { default as React, PropsWithChildren } from 'react';

interface CardProps {
    title: string;
}

export const Card = (props: PropsWithChildren<CardProps>) => (
    <section className={styles.settingSection}>
        <header className={styles.settingTitle}>{props.title}</header>
        <article className={styles.settingCard}>{props.children}</article>
    </section>
);

interface CardLineProps {
    title: string;
    subtitle?: string;
    isSubline?: boolean;
}

/** 选项卡片元素 */
export const CardLine = (props: PropsWithChildren<CardLineProps>) => (
    <div className={ props.isSubline ? styles.settingSubline : styles.settingLine }>
        <span>
            <div className={styles.settingLineName}>{props.title}</div>
            { props.subtitle ? <div className={styles.settingLineSubname}>{props.subtitle}</div> : '' }
        </span>
        <span>{props.children}</span>
    </div>
);
