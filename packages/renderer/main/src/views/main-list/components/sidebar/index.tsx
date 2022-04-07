import React from 'react';

import { style } from './style';
import { TagList, TagListRef } from '../tags';
import { ActionsContainer, ActionItem } from '../actions';

import { useRef } from 'react';
import { FolderAddOutlined, MinusSquareOutlined } from '@ant-design/icons';

export function Sidebar() {
  const listRef = useRef<TagListRef>(null);

  return (
    <div className={style.classes.main}>
      <header className={style.classes.header}>
        <div className={style.classes.title}>标签管理器</div>
        <ActionsContainer className={style.classes.headerActions}>
          <ActionItem title='新建标签集'>
            <FolderAddOutlined
              style={{ transform: 'scaleY(1.2)' }}
              onClick={() => listRef.current?.createTagGroup()}
            />
          </ActionItem>
          <ActionItem title='在标签管理器中折叠标签'>
            <MinusSquareOutlined onClick={() => listRef.current?.collapseAll()} />
          </ActionItem>
        </ActionsContainer>
      </header>
      <article className={style.classes.body}>
        <TagList ref={listRef} />
      </article>
    </div>
  );
}
