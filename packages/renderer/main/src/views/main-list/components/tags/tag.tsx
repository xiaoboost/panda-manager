import React from 'react';

import { styles } from './style';
import { Indent } from './indent';
import { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Input, InputRef, Panel, PanelItem, PanelSplit } from '@panda/components';
import {
  TagData,
  NewTagData,
  NewTagGroupData,
  PatchTagData,
  PatchTagGroupData,
} from '@panda/shared';
import { isDef } from '@xiao-ai/utils';
import { MouseButtons } from '@xiao-ai/utils/web';
import { fetch, ServiceName } from '@panda/fetch/renderer';

export interface TagProps {
  /** 编号 */
  id?: number;
  /** 上级元素编号 */
  parentId?: number;
  /** 是否是标签集 */
  isGroup: boolean;
  /** 标签名称 */
  name: string;
  /** 子标签 */
  tags?: TagData[];
  /** 初始状态为编辑 */
  startWithEditor?: boolean;
  /** 更新所有标签数据 */
  update?(): void;
}

export interface TagRef {
  /** 进入编辑状态 */
  edit(): void;
  /** 折叠子项 */
  collapse(): void;
  /** 展开子项 */
  unCollapse(): void;
}

export const Tag = forwardRef<TagRef, TagProps>(function Tag(
  { id, name, isGroup, startWithEditor = false, tags, parentId, update },
  ref,
) {
  const { classes } = styles;
  const [isEdit, setEdit] = useState(startWithEditor);
  const [isCollapse, setCollapse] = useState(true);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelPosition, setPanelPosition] = useState([0, 0]);
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<InputRef>(null);

  useImperativeHandle(ref, () => ({
    edit() {
      setEdit(true);
    },
    collapse() {
      setCollapse(true);
    },
    unCollapse() {
      setCollapse(false);
    },
  }));

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit, inputRef.current]);

  const editEnd = () => {
    if (isDef(id)) {
      fetch<void, PatchTagGroupData | PatchTagData>(
        isGroup ? ServiceName.PatchTagGroup : ServiceName.PatchTag,
        {
          id,
          name: inputVal,
        },
      ).then(update);
    } else {
      if (isGroup) {
        fetch<void, NewTagGroupData>(ServiceName.AddTagGroup, { name: inputVal }).then(update);
      } else if (parentId) {
        fetch<any, NewTagData>(ServiceName.AddTag, {
          name: inputVal,
          groupId: parentId,
        }).then(update);
      }
    }
  };

  const tagClickHandler: React.MouseEventHandler = (ev) => {
    // 左键
    if (ev.buttons === MouseButtons.Left) {
      // 非编辑模式
      if (!isEdit) {
        setCollapse(!isCollapse);
      }
    }
    // 右键
    else if (ev.buttons === MouseButtons.Right) {
      // 强制取消编辑模式
      if (isEdit) {
        setEdit(false);
      }

      setPanelVisible(true);
      setPanelPosition([ev.pageX, ev.pageY]);
    }
  };

  return (
    <>
      <div className={classes.row} onClick={tagClickHandler}>
        {!isGroup && <Indent />}
        <span className={classes.icon}>{isCollapse ? <RightOutlined /> : <DownOutlined />}</span>
        {isEdit ? (
          <Input
            ref={inputRef}
            value={inputVal}
            onChange={setInputVal}
            onBlur={editEnd}
            onPressEnter={editEnd}
            inputClassName={classes.innerInput}
          />
        ) : (
          <span className={classes.title} title={name}>
            <a className={classes.titleLabel}>{name}</a>
          </span>
        )}
        {!isCollapse &&
          (tags ?? []).map((item) => (
            <Tag
              key={`tag-${item.id}`}
              id={item.id}
              name={item.name}
              isGroup={false}
              parentId={id}
              update={update}
            />
          ))}
      </div>
      <Panel visible={panelVisible} x={panelPosition[0]} y={panelPosition[1]}>
        <PanelItem disabled>选择以搜索</PanelItem>
        <PanelSplit />
        <PanelItem>复制文本</PanelItem>
        {isGroup && <PanelItem>新建标签</PanelItem>}
        <PanelSplit />
        <PanelItem disabled>编辑元数据</PanelItem>
        <PanelItem onClick={() => setEdit(true)}>重命名</PanelItem>
        <PanelItem>删除</PanelItem>
      </Panel>
    </>
  );
});
