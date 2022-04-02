import React from 'react';
import ReactDom from 'react-dom';

import { stringifyClass as cla } from '@xiao-ai/utils';
import { PropsWithChildren } from 'react';
import { Button } from '../button';
import { useKeyboard } from '@panda/renderer-utils';
import { modalContainer } from './store';
import { styles } from './style';

import { CloseOutlined } from '@ant-design/icons';

export interface ModalProps {
  /** 对话框类名 */
  className?: string;
  /** 遮罩类名 */
  maskClassName?: string;
  /** 是否可见 */
  visible?: boolean;
  /** 对话框标题 */
  title: string;
  /** 面板宽度 */
  width?: number;
  /** 是否有遮罩 */
  mask?: boolean;
  /** 是否允许点击蒙层关闭 */
  maskClosable?: boolean;
  /** 是否允许按下键盘`ESC`按钮关闭 */
  escClosable?: boolean;
  /** 是否有关闭按钮 */
  closable?: boolean;
  /** 确定按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 关闭事件 */
  onClose?(): void;
  /** 确定按钮回调 */
  onOk?(): void;
  /** 取消按钮回调 */
  onCancel?(): void;
}

export function Modal({
  className,
  maskClassName,
  title,
  width,
  visible = false,
  mask = true,
  maskClosable = true,
  escClosable = true,
  closable = true,
  okText = '确定',
  cancelText = '取消',
  onClose,
  onOk,
  onCancel,
  children,
}: PropsWithChildren<ModalProps>) {
  const { classes: cln } = styles;
  const maskClickHandler = maskClosable ? () => onClose?.() : undefined;

  useKeyboard('esc', () => {
    if (escClosable && onClose) {
      onClose();
    }
  });

  if (!visible) {
    return ReactDom.createPortal(null, modalContainer);
  }

  return ReactDom.createPortal(
    <div className={cln.wrapper}>
      {mask && <div className={cla(cln.mask, maskClassName)} onClick={maskClickHandler} />}
      <div className={cla(cln.modal, className)} style={{ width }}>
        <div className={cln.header}>
          {title}
          {closable ? (
            <CloseOutlined
              className={cln.headerIcon}
              title='关闭对话框'
              onClick={() => onClose?.()}
            />
          ) : (
            <span />
          )}
        </div>
        <div className={cln.body}>{children}</div>
        <div className={cln.footer}>
          <Button className={cln.btn} onClick={onOk}>
            {okText}
          </Button>
          <Button type='normal' className={cln.btn} onClick={onCancel}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    modalContainer,
  );
}
