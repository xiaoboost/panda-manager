import React from 'react';

import { styles } from './style';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Panel, PanelItem, PanelSplit } from '@panda/components';
import { NewTagData, NewTagGroupData, PatchTagGroupData, TagData } from '@panda/shared';
import { clipboard } from 'electron';
import { MouseButtons } from '@xiao-ai/utils/web';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { TagBase, TagBaseRef } from './tag-base';
import { Tag } from './tag';
import { delateTag } from './dialog';

export interface TagGroupProps {
  /** 编号 */
  id: number;
  /** 新建标签集 */
  isNew?: boolean;
  /** 标签名称 */
  title?: string;
  /** 子标签 */
  tags?: TagData[];
  /** 更新所有标签数据 */
  update?(): void;
}

export interface TagGroupRef {
  /** 折叠子项 */
  collapse(): void;
  /** 展开子项 */
  unCollapse(): void;
}

export const TagGroup = forwardRef<TagGroupRef, TagGroupProps>(function TagGroup(
  { id, title = '', isNew = false, tags = [], update },
  ref,
) {
  const { classes } = styles;
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelPosition, setPanelPosition] = useState([0, 0]);
  const [isCollapse, setCollapse] = useState(true);
  const [newTag, setNewTag] = useState(false);
  const tagRef = useRef<TagBaseRef>(null);

  useImperativeHandle(ref, () => ({
    collapse() {
      setCollapse(true);
    },
    unCollapse() {
      setCollapse(false);
    },
  }));

  const tagClickLeft: React.MouseEventHandler = (ev) => {
    if (ev.button === MouseButtons.Left) {
      // 非编辑模式
      if (!tagRef.current?.isEdit) {
        setCollapse(!isCollapse);
      }
    }
  };
  const tagClickRight: React.MouseEventHandler = (ev) => {
    if (ev.button === MouseButtons.Right) {
      // 强制取消编辑模式
      if (tagRef.current?.isEdit) {
        tagRef.current?.blur();
      }

      setPanelVisible(true);
      setPanelPosition([ev.pageX, ev.pageY]);
    }
  };
  const editEnd = (val: string) => {
    // 未修改名称
    if (val === title) {
      return;
    }

    if (isNew) {
      fetch<void, NewTagGroupData>(ServiceName.AddTagGroup, {
        name: val,
      }).then(update);
    } else {
      fetch<void, PatchTagGroupData>(ServiceName.PatchTagGroup, {
        id,
        name: val,
      }).then(update);
    }
  };
  const newTagHandler = () => {
    setNewTag(true);
    setPanelVisible(false);
    setCollapse(false);
  };
  const newTagEndHandler = (val: string) => {
    if (!val) {
      return;
    }

    fetch<any, NewTagData>(ServiceName.AddTag, {
      name: val,
      groupId: id,
    }).then(update);
  };
  const copyTextHandler = () => {
    clipboard.writeText(title);
    setPanelVisible(false);
  };
  const renameHandler = () => {
    tagRef.current?.edit();
    setPanelVisible(false);
  };
  const deleteHandler = async () => {
    setPanelVisible(false);

    if (await delateTag(title, true)) {
      // ..
    }
  };

  return (
    <>
      <div className={classes.tagGroup} onClick={tagClickLeft} onContextMenu={tagClickRight}>
        <TagBase
          ref={tagRef}
          title={title}
          startEdit={isNew}
          icon={isCollapse ? <RightOutlined /> : <DownOutlined />}
          onEditEnd={editEnd}
        />
      </div>
      {newTag && <TagBase indent={1} startEdit key='tag-new' onEditEnd={newTagEndHandler} />}
      {!isCollapse &&
        tags.map((data) => (
          <Tag key={`tag-${data.id}`} id={data.id} title={data.name} update={update} />
        ))}
      <Panel
        stopPropagation
        visible={panelVisible}
        x={panelPosition[0]}
        y={panelPosition[1]}
        onBlur={() => setPanelVisible(false)}
      >
        <PanelItem onClick={newTagHandler}>新建标签</PanelItem>
        <PanelItem onClick={copyTextHandler}>复制文本</PanelItem>
        <PanelSplit />
        <PanelItem disabled>编辑元数据</PanelItem>
        <PanelItem onClick={renameHandler}>重命名</PanelItem>
        <PanelItem onClick={deleteHandler}>删除</PanelItem>
      </Panel>
    </>
  );
});
