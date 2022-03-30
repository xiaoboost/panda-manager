import React from 'react';

import { styles } from './style';
import { Indent } from './indent';
import { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Input, InputRef } from '@panda/components';

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
  /** 标签名称是否重复 */
  onEditValidate?(val: string): string | void;
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
  { title = '', indent = 0, icon, startEdit = false, onEditEnd, onEditValidate },
  ref,
) {
  const { classes } = styles;
  const [isEdit, setEdit] = useState(startEdit);
  const [isEditError, setEditError] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<InputRef>(null);
  const ignoreBlur = useRef(false);

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

  /** 编辑取消 */
  const editCancel = () => {
    setEdit(false);
    onEditEnd?.(title);
    setInputVal(title);
  };
  /** 编辑确认 */
  const editEnter = () => {
    setEdit(false);
    onEditEnd?.(inputVal);
  };

  const inputChangeHandler = (val: string, status: boolean) => {
    setEditError(!status);
    setInputVal(val);
  };
  const blurHandler = () => {
    // 忽略 blur 事件的状态只保留一次
    if (ignoreBlur.current) {
      ignoreBlur.current = false;
      return;
    }

    setEdit(false);

    // 有错误时触发取消操作
    if (isEditError) {
      editCancel();
    }
    // 在编辑状态
    else if (isEdit) {
      onEditEnd?.(inputVal);
    }
  };
  const pressEnterHandler = () => {
    if (!isEditError) {
      ignoreBlur.current = true;
      editEnter();
    }
  };
  const pressEscHandler = () => {
    ignoreBlur.current = true;
    editCancel();
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
          onChange={inputChangeHandler}
          onBlur={blurHandler}
          onPressEnter={pressEnterHandler}
          onPressEsc={pressEscHandler}
          validate={onEditValidate}
          className={classes.input}
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
