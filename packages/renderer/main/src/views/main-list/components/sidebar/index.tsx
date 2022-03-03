import React from 'react';

import { style } from './style';
import { FileAddOutlined, FolderAddOutlined, MinusSquareOutlined } from '@ant-design/icons';

export function Sidebar() {
  return (
    <div className={style.classes.main}>
      <header className={style.classes.header}>
        <div className={style.classes.title}>标签管理器</div>
        <ul className={style.classes.actionsContainer}>
          <li className={style.classes.actionItem}>
            <a title='新建标签'>
              <FileAddOutlined
                className={style.classes.actionLabel}
                style={{ transform: 'scaleY(0.95)' }}
              />
            </a>
          </li>
          <li className={style.classes.actionItem}>
            <a title='新建标签集'>
              <FolderAddOutlined
                className={style.classes.actionLabel}
                style={{ transform: 'scaleY(1.2)' }}
              />
            </a>
          </li>
          <li className={style.classes.actionItem}>
            <a title='在标签管理器中折叠标签'>
              <MinusSquareOutlined className={style.classes.actionLabel} />
            </a>
          </li>
        </ul>
      </header>
      <article className={style.classes.body}>列表</article>
    </div>
  );
}
