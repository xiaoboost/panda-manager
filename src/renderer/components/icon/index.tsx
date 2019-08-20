import * as React from 'react';
import * as icons from './data';

interface IconProps {
    type: keyof typeof icons;
    className?: string;
    onClick?(event: React.MouseEvent): any;
}

export default function Icon({ type: name, className, onClick }: IconProps) {
    const data = icons[name];

    if (!data) {
        return <i>无</i>;
    }

    let customClass = `anticon anticon-${name}`;

    if (className) {
        customClass += ' ' + className;
    }

    return (
        <i className={customClass} onClick={onClick}>
            <svg
                viewBox={data.viewBox}
                version="1.1"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true">
                <path d={data.path} />
            </svg>
        </i>
    );
}
