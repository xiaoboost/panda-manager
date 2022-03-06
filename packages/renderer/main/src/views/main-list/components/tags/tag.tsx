import React from 'react';

import { styles } from './style';
import { Indent } from './indent';
import { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Input, InputRef } from '@panda/components';
import { TagData, NewTagData, TagKind, ServiceName } from '@panda/shared';
import { isDef } from '@xiao-ai/utils';
import { MouseButtons } from '@xiao-ai/utils/web';
import { fetch } from '@panda/fetch/renderer';

export interface TagProps {
  /** 编号 */
  id?: number;
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

// 选择以搜索

// 复制名称

// 新建标签

// 编辑元数据  F3
// 重命名   F2
// 删除     Delete

export const Tag = forwardRef<TagRef, TagProps>(function Tag(
  { id, name, isGroup, startWithEditor = false, tags, update },
  ref,
) {
  const { classes } = styles;
  const [isEdit, setEdit] = useState(startWithEditor);
  const [isCollapse, setCollapse] = useState(true);
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
      // 修改
    } else {
      fetch<any, NewTagData>(ServiceName.AddTag, {
        kind: isGroup ? TagKind.Group : TagKind.Tag,
        name: inputVal,
      }).then(update);
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
              update={update}
            />
          ))}
      </div>
    </>
  );
});
