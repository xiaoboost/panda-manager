import React from 'react';

import { styles } from './style';
import { Indent } from './indent';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Input, InputRef } from '@panda/components';

export interface TagItemData {
  /** 编号 */
  id?: number;
  /** 标签名称 */
  title: string;
  /** 是否是标签集 */
  isGroup: boolean;
  /** 上级标签集编号 */
  groupId?: number;
  /** 是否折叠 */
  isCollapse?: boolean;
  /** 是否是新建 */
  isNew?: boolean;
}

export interface TagProps extends TagItemData {
  /** 右键单击事件 */
  onRightClick?(ev: React.MouseEvent): void;
  /** 左键单击事件 */
  onClick?(ev: React.MouseEvent): void;
  /** 更新所有标签数据 */
  onEditEnd?(val: string): void;
  /** 标签名称是否重复 */
  onEditValidate?(val: string): string | void;
}

export interface TagRef {
  /** 编辑状态 */
  isEdit: boolean;
  /** 进入编辑状态 */
  edit(): void;
  /** 取消焦点 */
  blur(): void;
}

export const Tag = forwardRef<TagRef, TagProps>(function Tag(
  {
    title = '',
    isNew = false,
    isGroup = true,
    isCollapse = false,
    onClick,
    onRightClick,
    onEditEnd,
    onEditValidate,
  },
  ref,
) {
  const { classes: cln } = styles;
  const [isEdit, setEdit] = useState(isNew);
  const [isEditError, setEditError] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<InputRef>(null);
  const ignoreBlur = useRef(false);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  useImperativeHandle(ref, () => ({
    get isEdit() {
      return isEdit;
    },
    edit() {
      setEdit(true);
      setInputVal(title);
    },
    blur() {
      setEdit(false);
      onEditEnd?.(inputVal);
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
  const leftClickHandler: React.MouseEventHandler = (ev) => {
    if (!isEdit) {
      onClick?.(ev);
    }
  };

  return (
    <div className={cln.tagRow} onContextMenu={onRightClick} onClick={leftClickHandler}>
      {!isGroup && <Indent />}
      <div className={cln.icon}>
        {isGroup ? (
          isCollapse ? (
            <RightOutlined />
          ) : (
            <DownOutlined />
          )
        ) : (
          <span className={cln.spaceIcon} />
        )}
      </div>
      {isEdit ? (
        <Input
          ref={inputRef}
          value={inputVal}
          onChange={inputChangeHandler}
          onBlur={blurHandler}
          onPressEnter={pressEnterHandler}
          onPressEsc={pressEscHandler}
          validate={onEditValidate}
          className={cln.input}
          inputClassName={cln.innerInput}
        />
      ) : (
        <span className={cln.title} title={title}>
          <a className={cln.titleLabel}>{title}</a>
        </span>
      )}
    </div>
  );
});
