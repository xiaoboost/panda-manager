import React from 'react';

import { style } from './style';

interface Props {
  icon?: React.ReactNode;
  left?: string;
  right?: string;
}

export function Footer(props: Props) {
  return (
    <div className={style.classes.footer}>
      <div className={style.classes.footerItem}>
        {props.icon && <div>{props.icon}</div>}
        <div>{props.left}</div>
      </div>
      <div className={style.classes.footerItem}>{props.right}</div>
    </div>
  );
}
