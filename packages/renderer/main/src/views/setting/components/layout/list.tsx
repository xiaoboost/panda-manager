import React from 'react';

import { styles } from './style';
import { Button } from '@panda/components';
import { CloseOutlined } from '@ant-design/icons';

export interface ListProps {
  /** 列表数据 */
  data: string[];
  // /** 禁用编辑 */
  // editDisabled?: boolean;
  // /** 禁用列表 */
  // disabled?: boolean;
  /** 新增按钮文本 */
  addText?: string;
  // /** 编辑回调 */
  // onEdit?(val: string, index: number): void;
  /** 删除回调 */
  onDelete?(val: string, index: number): void;
  /** 新增回调 */
  onAdd?(): void;
  /** 自定义按钮 */
  action?: {
    icon: React.ReactNode;
    onClick(val: string, index: number): void;
  };
}

export function List({ data, addText = '添加', action, onAdd, onDelete }: ListProps) {
  const { classes: cla } = styles;

  return (
    <div className={cla.listWrapper}>
      <ul className={cla.listContainer}>
        {data.map((item, i) => (
          <li key={i} className={cla.listItem} title={`文件夹：“${item}”`}>
            <span className={cla.listContext}>{item}</span>
            <span className={cla.listActions}>
              {action && (
                <div className={cla.listAction} onClick={() => action.onClick(item, i)}>
                  {action.icon}
                </div>
              )}
              <div className={cla.listAction} onClick={() => onDelete?.(item, i)}>
                <CloseOutlined />
              </div>
            </span>
          </li>
        ))}
      </ul>
      <div>
        <Button onClick={onAdd} style={{ marginTop: data.length === 0 ? 6 : 4 }}>
          {addText}
        </Button>
      </div>
    </div>
  );
}
