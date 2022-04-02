import React from 'react';

import { styles } from './style';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Float } from '@panda/components';
import { MenuItem, MenuSplit } from 'src/components/context-menu';
import { NewTagData, NewTagGroupData, PatchTagGroupData, TagData } from '@panda/shared';
import { clipboard } from 'electron';
import { MouseButtons } from '@xiao-ai/utils/web';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { TagBase, TagBaseRef } from './tag-base';
import { Tag } from './tag';
import { delateTag } from './dialog';
import { MetaModal } from '../meta-modal';

export interface TagGroupProps {
  /** 编号 */
  id: number;
  /** 新建标签集 */
  isNew?: boolean;
  /** 标签名称 */
  title?: string;
  /** 子标签 */
  tags?: TagData[];
  /**
   * 编辑结束
   *   - `refresh`是否需要刷新列表
   */
  onEditEnd(refresh: boolean): void;
  /** 标签集名称验证 */
  onEditValidate?(val: string): string | void;
}

export interface TagGroupRef {
  /** 折叠子项 */
  collapse(): void;
  /** 展开子项 */
  unCollapse(): void;
}

export const TagGroup = forwardRef<TagGroupRef, TagGroupProps>(function TagGroup(
  { id, title = '', isNew = false, tags = [], onEditEnd, onEditValidate },
  ref,
) {
  const { classes } = styles;
  const [metaVisible, setMetaVisible] = useState(false);
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

  const refreshList = () => onEditEnd(true);
  const tagNameValidate = (val: string) => {
    if (tags.find((group) => group.name === val)) {
      return `此位置已经存在标签 "${val}"，请选择其他名称`;
    }
  };
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
      onEditEnd(false);
      return;
    }

    if (isNew) {
      fetch<void, NewTagGroupData>(ServiceName.AddTagGroup, {
        name: val,
      }).then(refreshList);
    } else {
      fetch<void, PatchTagGroupData>(ServiceName.PatchTagGroup, {
        id,
        name: val,
      }).then(refreshList);
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
    }).then(refreshList);
  };
  const copyTextHandler = () => {
    clipboard.writeText(title);
    setPanelVisible(false);
  };
  const renameHandler = () => {
    tagRef.current?.edit();
    setPanelVisible(false);
  };
  const deleteHandler = () => {
    setPanelVisible(false);
    delateTag(title, true).then(refreshList);
  };
  const editGroupMetaHandler = () => {
    setPanelVisible(false);
    setMetaVisible(true);
    // fetch<void, PatchTagMetaData>(ServiceName.PatchTagGroupMeta, { id }).then(refreshList);
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
          onEditValidate={onEditValidate}
        />
      </div>
      {newTag && <TagBase indent={1} startEdit key='tag-new' onEditEnd={newTagEndHandler} />}
      {!isCollapse &&
        tags.map((data) => (
          <Tag
            key={`tag-${data.id}`}
            id={data.id}
            title={data.name}
            update={refreshList}
            onEditValidate={tagNameValidate}
          />
        ))}
      <MetaModal isGroup visible={metaVisible} onCancel={() => setMetaVisible(false)} />
      <Float
        stopPropagation
        visible={panelVisible}
        x={panelPosition[0]}
        y={panelPosition[1]}
        onBlur={() => setPanelVisible(false)}
      >
        <MenuItem onClick={newTagHandler}>新建标签</MenuItem>
        <MenuItem onClick={copyTextHandler}>复制文本</MenuItem>
        <MenuSplit />
        <MenuItem onClick={editGroupMetaHandler}>编辑元数据</MenuItem>
        <MenuItem onClick={renameHandler}>重命名</MenuItem>
        <MenuItem onClick={deleteHandler}>删除</MenuItem>
      </Float>
    </>
  );
});
