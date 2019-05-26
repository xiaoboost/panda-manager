import { default as React } from 'react';

import { Icon, Menu, Dropdown } from 'antd';

import { Manga } from 'render/lib/manga';
import { useStore } from 'render/lib/store';
import { sortOption } from 'render/store';
import { SortOption, SortBy } from 'src/render/store/cache';

/** 按照排序己算当前漫画列表 */
export function getMangasList(items: AnyObject<Manga>, option: SortOption) {
    /** 排序函数类型 */
    type Compare = (pre: number | string, next: number | string) => 1 | -1;

    const compare: Compare = option.asc
        ? (pre, next) => pre > next ? 1 : -1
        : (pre, next) => pre > next ? -1 : 1;

    let getValue: (item: Manga) => number | string;

    switch (option.by) {
        case SortBy.name:
            getValue = (item: Manga) => item.name;
            break;
        case SortBy.lastModified:
            getValue = (item: Manga) => item.file.lastModified;
            break;
        default:
    }

    return Object.values(items).sort((pre, next) => {
        return compare(getValue(pre), getValue(next));
    });
}

/** 排序选项下拉列表 */
export default function SortDropMenu() {
    /** 排序依据选项列表 */
    const sortByList = [
        {
            key: SortBy.name,
            label: '按名称',
        },
        {
            key: SortBy.lastModified,
            label: '按修改时间',
        },
    ];
    /** 排序顺序选项列表 */
    const sortAscList = [
        {
            key: true,
            label: '顺序',
        },
        {
            key: false,
            label: '倒序',
        },
    ];

    const [state, setState] = useStore(sortOption);

    const SortMenu = (
        <Menu id='sort-menu'>
            {sortByList.map(({ key, label }) =>
                <Menu.Item key={key}>
                    <a onClick={() => setState({ ...state, by: key })}>
                        {state.by === key
                            ? <Icon type='check' theme='outlined' />
                            : <i className='anticon' />
                        }
                        <span>{label}</span>
                    </a>
                </Menu.Item>,
            )}
            <Menu.Divider />
            {sortAscList.map(({ key, label }) =>
                <Menu.Item key={Number(key)}>
                <a onClick={() => setState({ ...state, asc: key })}>
                        {state.asc === key
                            ? <Icon type='check' theme='outlined' />
                            : <i className='anticon' />
                        }
                        <span>{label}</span>
                    </a>
                </Menu.Item>,
            )}
        </Menu>
    );

    return (
        <Dropdown overlay={SortMenu} trigger={['click']}>
            <Icon
                type='sort-ascending'
                theme='outlined'
                style={{ fontSize: '22px', top: '-1px' }}
            />
        </Dropdown>
    );
}
