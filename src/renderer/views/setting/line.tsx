import { default as React, PropsWithChildren } from 'react';

/** 选项卡片选项属性 */
interface CardLineProps {
    title: string;
    subtitle?: string;
    isSubline?: boolean;
}

/** 选项卡片元素 */
export default function CardLine(props: PropsWithChildren<CardLineProps>) {
    return <div className={ props.isSubline ? 'setting-subline' : 'setting-line' }>
        <span>
            <div className='setting-line__name'>{props.title}</div>
            { props.subtitle ? <div className='setting-line__subname'>{props.subtitle}</div> : ''}
        </span>
        <span>{props.children}</span>
    </div>;
}
