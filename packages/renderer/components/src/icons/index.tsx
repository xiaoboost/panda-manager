import * as React from 'react';
import * as icons from './data';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?(event: React.MouseEvent): any;
  onDoubleClick?(event: React.MouseEvent): any;
}

function createIcon(name: string, data: icons.Icon) {
  return function Icon({ className, onClick, onDoubleClick, style }: IconProps) {
    let customClass = `panda-icon panda-icon-${name}`;

    if (className) {
      customClass += ' ' + className;
    }

    return (
      <i className={customClass} style={style} onClick={onClick} onDoubleClick={onDoubleClick}>
        <svg
          viewBox={data.viewBox}
          version='1.1'
          width='1em'
          height='1em'
          fill={data.fill ? data.fill : 'currentColor'}
          aria-hidden='true'
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
