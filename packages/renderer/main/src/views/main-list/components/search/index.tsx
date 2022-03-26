import React from 'react';

import { styles } from './style';
import { useMemo } from 'react';
import { Select, SelectOption } from '@panda/components';
import { SearchOperation, SearchKind, SearchOption } from '@panda/shared';

import { QueryItem, QueryItemData } from './query-item';

export interface SearchBarProps {
  visible: boolean;
  data: SearchOption[];
  onClose?(): void;
  onChange?(options: SearchOption[]): void;
}

export function SearchBar({ visible, data, onClose, onChange }: SearchBarProps) {
  const { classes: cln } = styles;
  const items: QueryItemData[] = useMemo(() => data.map((item) => ({} as any)), [data]);
  const deleteHandler = (index: number) => {
    onChange?.(data.filter((v, i) => i !== index));
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={cln.search}>
      {items.length > 0 && (
        <div className={cln.queryList}>
          {items.map((v, i) => (
            <QueryItem {...v} onDelete={() => deleteHandler(i)} />
          ))}
        </div>
      )}
      <div className={cln.queryInput}></div>
    </div>
  );
}
