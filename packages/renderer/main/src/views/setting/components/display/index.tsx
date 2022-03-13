import React from 'react';

import { styles } from '../../style';
import { Form, FormItem } from '../layout';
import { SortOption, SortBy } from '@panda/shared';
import { Select, SelectOption, SelectOptionProps } from '@panda/components';

const sortByList: SelectOptionProps[] = [
  {
    value: SortBy.name,
    label: '按名称',
    default: true,
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
    <Form title='显示设置'>
      <FormItem title='排序方式' description='在主列表页中，所有项目按照哪个属性进行排列'>
        <Select
          className={styles.classes.select}
          value={sort.by}
          onChange={(val) =>
            setSort({
              by: val as SortBy,
            })
          }
        >
          {sortByList.map((data) => (
            <SelectOption key={data.value} {...data} />
          ))}
        </Select>
      </FormItem>
      <FormItem title='排列顺序' description='在主列表页中，所有项目是顺序还是倒序排列'>
        <Select
          className={styles.classes.select}
          value={sort.asc ? 1 : 0}
          onChange={(val) =>
            setSort({
              asc: val === 1,
            })
          }
        >
          <SelectOption default value={1} label='顺序排列' />
          <SelectOption value={0} label='倒序排列' />
        </Select>
      </FormItem>
    </Form>
  );
}
