import { default as React, useCallback } from 'react';

import Card from './card';
import CardLine from './line';

import { Switch, Select } from 'antd';

import { useWatcher } from 'renderer/lib/use';
import { SortBy, sortOption } from 'renderer/store';

const sortByList = [
    {
        value: SortBy.name,
        label: '按名称',
    },
    {
        value: SortBy.lastModified,
        label: '按最后的修改时间',
    },
];

export default function Display() {
    const [sort, setSort] = useWatcher(sortOption);

    const selectHandler = useCallback((val: SortBy) => setSort({
        ...sort,
        by: val,
    }), [sort.by]);

    const switchHandler = useCallback((val: boolean) => setSort({
        ...sort,
        asc: val,
    }), [sort.asc]);

    return (
        <Card title='漫画排序'>
            <CardLine title='排序方式'>
                <Select
                    style={{ width: 160 }}
                    defaultValue={sort.by}
                    onChange={selectHandler}>
                    {sortByList.map(({ value, label }) => (
                        <Select.Option key={value} value={value}>{label}</Select.Option>
                    ))}
                </Select>
            </CardLine>
            <CardLine title={sort.asc ? '顺序排列' : '倒序排列'}>
                <Switch
                    size='small'
                    checked={sort.asc}
                    onChange={switchHandler}
                />
            </CardLine>
        </Card>
    );
}
