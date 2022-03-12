import React from 'react';

import { styles } from './style';
import { Indent } from './indent';
import { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Input, InputRef } from '@panda/components';
import { MouseButtons } from '@xiao-ai/utils/web';

export interface TagBaseProps {
  /** 前置空格的数量 */
  indent?: number;
  /** 前置图标 */
  icon?: React.ReactNode;
  /** 标签名称 */
  title?: string;
  /** 初始状态为编辑 */
  startEdit?: boolean;
  /** 更新所有标签数据 */
  onEditEnd?(val: string): void;
}

export interface TagBaseRef {
  /** 进入编辑状态 */
  edit(): void;
  /** 取消焦点 */
  blur(): void;
  /** 编辑状态 */
  isEdit: boolean;
}

export const TagBase = forwardRef<TagBaseRef, TagBaseProps>(function Tag(
  { title = '', indent = 0, icon, startEdit = false, onEditEnd },
  ref,
) {
  const { classes } = styles;
  const [isEdit, setEdit] = useState(startEdit);
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit, inputRef.current]);

  useImperativeHandle(ref, () => ({
    edit() {
      setEdit(true);
      setInputVal(title);
    },
    blur() {
      setEdit(false);
      onEditEnd?.(inputVal);
    },
    get isEdit() {
      return isEdit;
    },
  }));

  const editCancel = () => {
    setEdit(false);
    onEditEnd?.(title);
    setInputVal(title);
  };
  const editEnd = () => {
    setEdit(false);
    onEditEnd?.(inputVal);
  };

  return (
    <div className={classes.row}>
      {Array(indent)
        .fill(1)
        .map((_, i) => (
          <Indent key={`indent-${i}`} />
        ))}
      <span className={classes.icon}>{icon ? icon : <span className={classes.spaceIcon} />}</span>
      {isEdit ? (
        <Input
          ref={inputRef}
          value={inputVal}
          onChange={setInputVal}
          onBlur={editEnd}
          onPressEnter={editEnd}
          onPressEsc={editCancel}
          inputClassName={classes.innerInput}
        />
      ) : (
        <span className={classes.title} title={title}>
          <a className={classes.titleLabel}>{title}</a>
        </span>
      )}
    </div>
  );
});
