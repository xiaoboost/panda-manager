import React from 'react';

import { style } from './style';
import { TagGroup, TagGroupRef } from '../tags';
import { ActionsContainer, ActionItem } from '../actions';

import { useState, useRef } from 'react';
import { log } from '@panda/shared';
import { FolderAddOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { tagData, fetchTagData } from 'src/store/tags';
import { useWatcher } from '@xiao-ai/utils/use';

export function Sidebar() {
  const [tags] = useWatcher(tagData);
  const { current: tagGroupRefs } = useRef<(TagGroupRef | null)[]>([]);
  const [newGroup, setNewGroup] = useState(false);

  const refresh = (needRefresh: boolean) => {
    setNewGroup(false);

    if (needRefresh) {
      if (process.env.NODE_ENV === 'development') {
        log('刷新标签数据');
      }

      fetchTagData();
    }
  };
  const collapseAll = () => {
    for (const ref of tagGroupRefs) {
      ref?.collapse();
    }
  };
  const tagGroupNameValidate = (val: string) => {
    if (tags.find((group) => group.name === val)) {
      return `此位置已经存在标签集 "${val}"，请选择其他名称`;
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
        {newGroup && (
          <TagGroup
            key='new-group'
            id={0}
            isNew
            onEditEnd={refresh}
            onEditValidate={tagGroupNameValidate}
          />
        )}
        {tags.map((data, i) => (
          <TagGroup
            ref={(ref) => (tagGroupRefs[i] = ref)}
            key={data.id}
            id={data.id}
            title={data.name}
            tags={data.tags}
            onEditEnd={refresh}
          />
        ))}
      </article>
    </div>
  );
}
