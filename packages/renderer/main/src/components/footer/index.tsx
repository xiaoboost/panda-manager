import React from 'react';

import { LoadingOutlined } from '@ant-design/icons';

import { styles } from './style';
import { useBroadcast, BroadcastName, fetchSync, ServiceName } from '@panda/fetch/renderer';

const defaultReadStatus = fetchSync<string>(ServiceName.GetReadStatus);

export function Footer() {
  const { classes } = styles;
  const readItem = useBroadcast(BroadcastName.ReadingStatusChange, defaultReadStatus.data);

  return (
    <div className={classes.footer}>
      <div className={classes.footerItem}>
        {readItem && (
          <>
            <LoadingOutlined className={styles.classes.footerIcon} />
            <div>{readItem}</div>
          </>
        )}
      </div>
      {/* <div className={classes.footerItem}>{props.right}</div> */}
    </div>
  );
}
