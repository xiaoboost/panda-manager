import React from 'react';

import { style } from './style';

export function Footer() {
  return (
    <footer className={style.classes.footer}>
      <button>确定</button>
      <button>取消</button>
    </footer>
  );
}
