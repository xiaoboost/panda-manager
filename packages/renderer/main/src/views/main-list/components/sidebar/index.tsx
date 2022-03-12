import React from 'react';

import { style } from './style';
import { TagGroup, TagGroupRef } from '../tags';
import { ActionsContainer, ActionItem } from '../actions';

import { useState, useEffect, useRef } from 'react';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { TagGroupData, log } from '@panda/shared';
import { FolderAddOutlined, MinusSquareOutlined } from '@ant-design/icons';

export function Sidebar() {
  const [tags, setTags] = useState<TagGroupData[]>([]);
  const { current: tagGroupRefs } = useRef<(TagGroupRef | null)[]>([]);
  const [newGroup, setNewGroup] = useState(false);

  // 初次加载
  useEffect(() => {
    fetch<TagGroupData[]>(ServiceName.GetAllTags).then(({ data }) => setTags(data));
  }, []);

  const refresh = () => {
    if (process.env.NODE_ENV === 'development') {
      log('刷新标签数据');
    }

    setNewGroup(false);
    fetch<TagGroupData[]>(ServiceName.GetAllTags).then(({ data }) => setTags(data));
  };
  const collapseAll = () => {
    for (const ref of tagGroupRefs) {
      ref?.collapse();
    }
  };

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
            <MinusSquareOutlined onClick={collapseAll} />
          </ActionItem>
        </ActionsContainer>
      </header>
      <article className={style.classes.body}>
        {newGroup && <TagGroup key='new-group' id={0} isNew update={refresh} />}
        {tags.map((data, i) => (
          <TagGroup
            ref={(ref) => (tagGroupRefs[i] = ref)}
            key={data.id}
            id={data.id}
            title={data.name}
            tags={data.tags}
            update={refresh}
          />
        ))}
      </article>
    </div>
  );
}
