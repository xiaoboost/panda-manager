import React from 'react';

// import { Switch, Select } from 'antd';
import { Card, CardLine } from '../card';
import { SortOption, SortBy } from '@panda/shared';

const sortByList = [
  {
    value: SortBy.name,
    label: '按名称',
  },
  {
    value: SortBy.size,
    label: '按原文件大小',
  },
  {
    value: SortBy.lastModified,
    label: '按最后的修改时间',
  },
];

interface Props {
  data: SortOption;
  patch(sort: SortOption): void;
}

export function Display({ data: sort, patch }: Props) {
  const setSort = (val: Partial<SortOption>) => {
    patch({ ...sort, ...val });
  };

  return (
    <Card title='漫画排序'>
      {/* <CardLine title='排序方式'>
        <Select style={{ width: 160 }} value={sort.by} onChange={(by: SortBy) => setSort({ by })}>
          {sortByList.map(({ value, label }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </CardLine>
      <CardLine title={sort.asc ? '顺序排列' : '倒序排列'}>
        <Switch size='small' checked={sort.asc} onChange={(asc: boolean) => setSort({ asc })} />
      </CardLine> */}
    </Card>
  );
}
