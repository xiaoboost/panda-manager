import * as React from 'react';
import * as icons from './data';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?(event: React.MouseEvent): any;
}

export function createIcon(name: string, data: icons.Data) {
  return function Icon({ className, onClick, style }: IconProps) {
    let customClass = `panda-icon panda-icon-${name}`;

    if (className) {
      customClass += ' ' + className;
    }

    return (
      <i className={customClass} onClick={onClick} style={style}>
        <svg
          viewBox={data.viewBox}
          version="1.1"
          width="1em"
          height="1em"
          fill={data.fill ? data.fill : 'currentColor'}
          aria-hidden="true"
        >
          <path d={data.path} />
        </svg>
      </i>
    );
  };
}

export const Recover = createIcon('recover', icons.recover);
export const Books = createIcon('books', icons.books);
export const Bamboo = createIcon('bamboo', icons.bamboo);
