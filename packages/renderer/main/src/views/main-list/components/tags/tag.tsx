import React from 'react';

import { styles } from './style';
import { useState, useRef } from 'react';
import { Panel, PanelItem, PanelSplit } from '@panda/components';
import { PatchTagData, PatchTagGroupData, PatchTagMetaData } from '@panda/shared';
import { clipboard } from 'electron';
import { MouseButtons } from '@xiao-ai/utils/web';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { TagBase, TagBaseRef } from './tag-base';
import { delateTag } from './dialog';

export interface TagProps {
  /** 编号 */
  id: number;
  /** 标签名称 */
  title: string;
  /** 更新所有标签数据 */
  update?(): void;
  /** 标签集名称验证 */
  onEditValidate?(val: string): string | void;
}

export function Tag({ id, title, update, onEditValidate }: TagProps) {
  const { classes } = styles;
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelPosition, setPanelPosition] = useState([0, 0]);
  const tagRef = useRef<TagBaseRef>(null);

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

    fetch<void, PatchTagGroupData | PatchTagData>(ServiceName.PatchTagGroup, {
      id,
      name: val,
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
  const deleteHandler = () => {
    setPanelVisible(false);
    delateTag(title, false).then(update);
  };
  const editMetaHandler = () => {
    setPanelVisible(false);
    fetch<void, PatchTagMetaData>(ServiceName.PatchTagMeta, { id }).then(update);
  };

  return (
    <div className={classes.tagGroup} onContextMenu={tagClickRight}>
      <TagBase
        indent={1}
        ref={tagRef}
        title={title}
        onEditEnd={editEnd}
        onEditValidate={onEditValidate}
      />
      <Panel
        stopPropagation
        visible={panelVisible}
        x={panelPosition[0]}
        y={panelPosition[1]}
        onBlur={() => setPanelVisible(false)}
      >
        <PanelItem disabled>选择以搜索</PanelItem>
        <PanelSplit />
        <PanelItem onClick={copyTextHandler}>复制文本</PanelItem>
        <PanelSplit />
        <PanelItem onClick={editMetaHandler}>编辑元数据</PanelItem>
        <PanelItem onClick={renameHandler}>重命名</PanelItem>
        <PanelItem onClick={deleteHandler}>删除</PanelItem>
      </Panel>
    </div>
  );
}
