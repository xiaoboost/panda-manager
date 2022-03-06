import React from 'react';

import { styles } from './style';

export function Indent() {
  return (
    <div className={styles.classes.indent}>
      <div className={styles.classes.indentGuide} />
    </div>
  );
}
