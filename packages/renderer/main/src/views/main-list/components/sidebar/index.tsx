import React from 'react';

import { style } from './style';
import { Container, ActionItem } from '../actions';
import { fetch } from '@panda/fetch/renderer';
import { ServiceName } from '@panda/shared';
import { FileAddOutlined, FolderAddOutlined, MinusSquareOutlined } from '@ant-design/icons';

export function Sidebar() {
  return (
    <div className={style.classes.main}>
      <header className={style.classes.header}>
        <div className={style.classes.title}>标签管理器</div>
        {/* <a title='新建标签'>
          <FileAddOutlined
            className={style.classes.actionLabel}
            style={{ transform: 'scaleY(0.95)' }}
          />
        </a> */}
        <Container className={style.classes.headerActions}>
          <ActionItem title='新建标签集'>
            <FolderAddOutlined
              style={{ transform: 'scaleY(1.2)' }}
              onClick={() => fetch(ServiceName.AddTag)}
            />
          </ActionItem>
          <ActionItem title='在标签管理器中折叠标签'>
            <MinusSquareOutlined />
          </ActionItem>
        </Container>
      </header>
      <article className={style.classes.body}>列表</article>
    </div>
  );
}
