import React from 'react';

import { style } from './style';

import { List } from './components/list';
import { Sidebar } from './components/sidebar';

export function MainList() {
  return (
    <div className={style.classes.section}>
      <Sidebar />
      <List />
    </div>
  );
}
