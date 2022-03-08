import React, { useEffect } from 'react';

import { style } from './style';
import { Tag } from '../tags';
import { ActionsContainer, ActionItem } from '../actions';

import { useState } from 'react';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { TagGroupData, log } from '@panda/shared';
import { FolderAddOutlined, MinusSquareOutlined } from '@ant-design/icons';

export function Sidebar() {
  const [tags, setTags] = useState<TagGroupData[]>([]);
  const [newGroup, setNewGroup] = useState(false);

  // 初次加载
  useEffect(() => {
    fetch<TagGroupData[]>(ServiceName.GetAllTags).then(({ data }) => setTags(data));
  }, []);

  function refresh() {
    if (process.env.NODE_ENV === 'development') {
      log('刷新标签数据');
    }

    setNewGroup(false);
    fetch<TagGroupData[]>(ServiceName.GetAllTags).then(({ data }) => setTags(data));
  }

  return (
    <div className={style.classes.main}>
      <header className={style.classes.header}>
        <div className={style.classes.title}>标签管理器</div>
        <ActionsContainer className={style.classes.headerActions}>
          <ActionItem title='新建标签集'>
            <FolderAddOutlined
              style={{ transform: 'scaleY(1.2)' }}
              onClick={() => setNewGroup(true)}
            />
          </ActionItem>
          <ActionItem title='在标签管理器中折叠标签'>
            <MinusSquareOutlined />
          </ActionItem>
        </ActionsContainer>
      </header>
      <article className={style.classes.body}>
        {newGroup && <Tag isGroup startWithEditor key='new-group' name='' update={refresh} />}
        {tags.map((data) => (
          <Tag isGroup key={data.id} id={data.id} name={data.name} update={refresh} />
        ))}
      </article>
    </div>
  );
}
