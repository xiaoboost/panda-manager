import React from 'react';

import {
  FontSizeOutlined,
  TagOutlined,
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import { styles } from './style';
import { SearchOperation, SearchKind } from '@panda/shared';

export interface QueryItemData {
  kind: SearchKind;
  operation: SearchOperation;
  content: string;
}

export interface QueryItemProps extends QueryItemData {
  onDelete?(): void;
}

export function QueryItem({ kind, operation, content, onDelete }: QueryItemProps) {
  const { classes: cln } = styles;
  const tips = `${kind === SearchKind.Tag ? '标签中' : '标题中'}${
    operation === SearchOperation.Plus ? '包含' : '不包含'
  }：${content}`;

  return (
    <div className={cln.queryItem} title={tips}>
      <div className={`${cln.queryIcon} ${cln.leftRadius}`}>
        {operation === SearchOperation.Plus ? <PlusOutlined /> : <MinusOutlined />}
      </div>
      <div className={cln.queryIcon}>
        {kind === SearchKind.Tag ? <TagOutlined /> : <FontSizeOutlined />}
      </div>
      <div className={cln.queryText}>{content}</div>
      <div className={`${cln.queryIcon} ${cln.rightRadius}`} onClick={onDelete}>
        <CloseOutlined />
      </div>
    </div>
  );
}
