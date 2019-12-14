import styles from './index.less';

import { default as React, PropsWithChildren } from 'react';

/** 选项卡片选项属性 */
interface CardLineProps {
    title: string;
    subtitle?: string;
    isSubline?: boolean;
}

/** 选项卡片元素 */
export default function CardLine(props: PropsWithChildren<CardLineProps>) {
    return <div className={ props.isSubline ? styles.settingSubline : styles.settingLine }>
        <span>
            <div className={styles.settingLineName}>{props.title}</div>
            { props.subtitle ?? <div className={styles.settingLineSubname}>{props.subtitle}</div>}
        </span>
        <span>{props.children}</span>
    </div>;
}
