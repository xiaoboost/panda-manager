import React from 'react';

import { ErrorPanel } from '../common/error-panel';

import { styles } from './style';
import { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { stringifyClass as cla } from '@xiao-ai/utils';

type InputEl = HTMLInputElement | HTMLTextAreaElement;

export interface TextareaSize {
  minRows: number;
  maxRows: number;
}

export interface InputProps {
  /** 输入框类别 */
  type?: string;
  /** 输入框的值 */
  value: string;
  /** 自适应内容高度 */
  autoSize?: boolean | TextareaSize;
  /** 内容最大长度 */
  maxLength?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 顶层类名 */
  className?: string;
  /** 顶层样式 */
  style?: React.CSSProperties;
  /** 内部输入框类名 */
  inputClassName?: string;
  /** 内部输入框样式 */
  inputStyle?: React.CSSProperties;
  /**
   * 校验值
   *   - 返回`undefined | null | void | ''`时表示校验通过
   *   - 返回字符串时表示校验未通过，且字符串为错误信息
   */
  validate?(val: string): string | undefined | null | void;
  /**
   * 输入值变更
   *   - 没有`validate`校验函数时，`validateStatus`永远为`true`
   *   - 有`validate`校验函数时，校验通过时`validateStatus`为`true`
   */
  onChange?(val: string, validateStatus: boolean): void;
  /** 键盘输入回车键时 */
  onPressEnter?(ev: React.KeyboardEvent<InputEl>): void;
  /** 键盘输入取消键时 */
  onPressEsc?(ev: React.KeyboardEvent<InputEl>): void;
  /** 获得焦点时 */
  onFocus?(ev: React.FocusEvent<InputEl>): void;
  /** 失去焦点时 */
  onBlur?(ev: React.FocusEvent<InputEl>): void;
}

export interface InputRef {
  /** 输入框获得焦点 */
  focus(): void;
  /** 输入框失去焦点 */
  blur(): void;
  /** 选中范围文本 */
  setSelectionRange(start: number, end: number): void;
  /** 选中文本 */
  select(): void;
}

export const Input = forwardRef<InputRef, InputProps>(function Input(props, ref) {
  const { classes } = styles;
  const boxRef = useRef<HTMLDivElement>(null);
  const inputEl = useRef<InputEl>(null);
  const [isFocus, setFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    type,
    value,
    onChange,
    maxLength,
    className,
    style,
    disabled,
    inputClassName,
    inputStyle,
    validate,
    onPressEnter,
    onPressEsc,
    onFocus,
    onBlur,
  } = props;

  useEffect(() => {
    setFocus((prev) => (prev && disabled ? false : prev));
  }, [disabled]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputEl.current?.focus?.();
    },
    blur() {
      inputEl.current?.blur?.();
    },
    setSelectionRange(start: number, end: number) {
      inputEl.current?.setSelectionRange?.(start, end);
    },
    select() {
      inputEl.current?.select?.();
    },
  }));

  const handleKeyDown = (e: React.KeyboardEvent<InputEl>) => {
    if (e.key === 'Enter') {
      onPressEnter?.(e);
    } else if (e.key === 'Escape') {
      onPressEsc?.(e);
    }
  };

  const handleFocus: React.FocusEventHandler<InputEl> = (e) => {
    setFocus(true);
    onFocus?.(e);
  };

  const handleBlur: React.FocusEventHandler<InputEl> = (e) => {
    setFocus(false);
    setErrorMessage('');
    onBlur?.(e);
  };

  const changeHandler: React.ChangeEventHandler<InputEl> = ({ target }) => {
    const val = target.value;
    let validateStatus = true;

    if (validate) {
      const result = validate(val);

      if (result) {
        validateStatus = false;
        setErrorMessage(result);
      } else {
        setErrorMessage('');
      }
    }

    onChange?.(val, validateStatus);
  };

  const TagName = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div
      ref={boxRef}
      className={cla(classes.box, classes.idle, className, {
        [classes.focus]: isFocus,
        [classes.disabled]: disabled ?? false,
        [classes.error]: errorMessage.length > 0,
      })}
      style={style}
    >
      <div className={classes.ibWrapper}>
        <TagName
          ref={inputEl as any}
          className={cla(classes.input, inputClassName)}
          style={inputStyle}
          type={type}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onChange={changeHandler}
        />
      </div>
      <ErrorPanel message={errorMessage} targetRef={boxRef} />
    </div>
  );
});
