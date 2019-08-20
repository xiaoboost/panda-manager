import * as React from 'react';
import * as icons from './data';

interface IconProps {
    type: keyof typeof icons;
    className?: string;
}

export default function Icon({ type: name, className }: IconProps) {
    const data = icons[name];

    if (!data) {
        return <i>无</i>;
    }

    return (
        <i className={`anticon anticon-${name} ${className}`}>
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
