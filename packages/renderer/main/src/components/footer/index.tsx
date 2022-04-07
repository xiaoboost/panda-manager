import React from 'react';
import path from 'path';

import { LoadingOutlined } from '@ant-design/icons';

import { styles } from './style';
import { useBroadcast, BroadcastName, fetchSync, ServiceName } from '@panda/fetch/renderer';

const defaultReadStatus = fetchSync<string>(ServiceName.GetReadStatus);

export function Footer() {
  const { classes } = styles;
  const readItem = useBroadcast(BroadcastName.ReadingStatusChange, defaultReadStatus.data);
  const basename = path.parse(readItem ?? '').name;

  return (
    <div className={classes.footer}>
      {readItem && (
        <div className={classes.footerItem}>
          <LoadingOutlined className={styles.classes.footerIcon} />
          <div className={classes.readStatus}>{basename}</div>
        </div>
      )}
      {/* <div className={classes.footerItem}>{props.right}</div> */}
    </div>
  );
}
