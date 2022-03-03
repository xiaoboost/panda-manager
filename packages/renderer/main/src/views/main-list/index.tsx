import React from 'react';

import { style } from './style';

import { List } from './components/list';
import { Sidebar } from './components/sidebar';
import { Footer } from './components/footer';

export function MainList() {
  return (
    <div className={style.classes.section}>
      <div className={style.classes.body}>
        <Sidebar />
        <List />
      </div>
      <Footer left='Nothing' />
    </div>
  );
}
