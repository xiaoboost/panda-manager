import React from 'react';

import { Card, CardLine } from './card';

import { Switch, Select } from 'antd';

import { Config } from '../../store';
import { useWatcher, useCallback } from '@utils/react-use';

const sortByList = [
    {
        value: Config.SortBy.name,
        label: '按名称',
    },
    {
        value: Config.SortBy.size,
        label: '按原文件大小',
    },
    {
        value: Config.SortBy.lastModified,
        label: '按最后的修改时间',
    },
];

export function Display() {
    const [{ sort }, setConfig] = useWatcher(Config.data);
    const setSort = (val: Partial<Config.SortOption>) => setConfig({
        sort: {
            ...sort,
            ...val,
        },
    });

    const sortByHandler = useCallback((by: Config.SortBy) => setSort({ by }), [sort.by]);
    const sortAscHandler = useCallback((asc: boolean) => setSort({ asc }), [sort.asc]);

    return (
        <Card title='漫画排序'>
            <CardLine title='排序方式'>
                <Select
                    style={{ width: 160 }}
                    defaultValue={sort.by}
                    onChange={sortByHandler}>
                    {sortByList.map(({ value, label }) => (
                        <Select.Option key={value} value={value}>{label}</Select.Option>
                    ))}
                </Select>
            </CardLine>
            <CardLine title={sort.asc ? '顺序排列' : '倒序排列'}>
                <Switch
                    size='small'
                    checked={sort.asc}
                    onChange={sortAscHandler}
                />
            </CardLine>
        </Card>
    );
}
