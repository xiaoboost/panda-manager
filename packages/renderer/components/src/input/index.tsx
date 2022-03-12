import React from 'react';

import { styles } from './style';
import { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { stringifyClass as cla } from '@xiao-ai/utils';

export interface InputProps {
  /** 输入框类别 */
  type?: string;
  /** 输入框的值 */
  value: string;
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
  /** 输入值变更 */
  onChange?(val: string): void;
  /** 键盘输入回车键时 */
  onPressEnter?(ev: React.KeyboardEvent<HTMLInputElement>): void;
  /** 键盘输入取消键时 */
  onPressEsc?(ev: React.KeyboardEvent<HTMLInputElement>): void;
  /** 获得焦点时 */
  onFocus?(ev: React.FocusEvent<HTMLInputElement>): void;
  /** 失去焦点时 */
  onBlur?(ev: React.FocusEvent<HTMLInputElement>): void;
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
  const [isFocus, setFocus] = useState(false);
  const inputEl = useRef<HTMLInputElement>(null);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      onPressEnter?.(e);
    } else if (e.key === 'Esc') {
      onPressEsc?.(e);
    }
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setFocus(true);
    onFocus?.(e);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setFocus(false);
    onBlur?.(e);
  };

  return (
    <div
      className={cla(classes.box, classes.idle, className, {
        [classes.focus]: isFocus,
        [classes.disabled]: disabled ?? false,
      })}
      style={style}
    >
      <div className={classes.ibWrapper}>
        <input
          ref={inputEl}
          className={cla(classes.input, inputClassName)}
          style={inputStyle}
          type={type}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onChange={({ target }) => onChange?.(target.value)}
        />
      </div>
    </div>
  );
});
