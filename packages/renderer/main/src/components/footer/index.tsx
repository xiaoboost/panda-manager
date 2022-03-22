import React from 'react';

import { LoadingOutlined } from '@ant-design/icons';

import { styles } from './style';
import { useReadItem } from './hook/use-read-item';

export function Footer() {
  const { classes } = styles;
  const readItem = useReadItem();

  return (
    <div className={classes.footer}>
      <div className={classes.footerItem}>
        {readItem && (
          <>
            <LoadingOutlined />
            <div>{readItem.file}</div>
          </>
        )}
      </div>
      {/* <div className={classes.footerItem}>{props.right}</div> */}
    </div>
  );
}
