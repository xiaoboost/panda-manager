import React from 'react';

import { Switch, Select } from 'antd';
import { Card, CardLine } from '../card';

import { useFollow } from 'src/utils/react-use';
import { toServer } from 'src/server/renderer';
import { SortOption, SortBy, EventName } from 'src/utils/typings';

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
    sort?: SortOption,
}

export function Render({ sort: prop }: Props) {
    const [sort, setOpt] = useFollow(prop || {
        by: SortBy.name,
        asc: true,
    });
    const setSort = (val: Partial<SortOption>) => {
        setOpt({ ...sort, ...val });
        toServer(EventName.UpdateSortOption, {
            params: val,
        });
    };
    const sortByHandler = (by: SortBy) => setSort({ by });
    const sortAscHandler = (asc: boolean) => setSort({ asc });

    return (
        <Card title='漫画排序'>
            <CardLine title='排序方式'>
                <Select
                    style={{ width: 160 }}
                    value={sort.by}
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
