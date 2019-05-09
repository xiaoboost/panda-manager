import { default as React } from 'react';

import { Link } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'antd';

import { Manga } from 'render/lib/manga';
import { SortOption, SortBy } from 'render/lib/cache';

import { useStore } from 'render/lib/store';
import { useObject } from 'render/lib/hooks';
import { sort, mangas } from 'render/store';
import { stringifyClass } from 'render/lib/utils';

/** 排序选项下拉列表 */
function SortDropMenu() {
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

    const [state, setState] = useStore(sort);

    const SortMenu = (
        <Menu id='sort-menu'>
            {sortByList.map(({ key, label }) =>
                <Menu.Item key={key}>
                    <a onClick={() => setState('Partial', { by: key })}>
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
                    <a onClick={() => setState('Partial', { asc: key })}>
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

/** 按照排序己算当前漫画列表 */
function getMangasList(items: AnyObject<Manga>, option: SortOption) {
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

export default function MangaList() {
    const [state] = useStore(mangas);
    const [sortState] = useStore(sort);
    const [selected, setSelected] = useObject<AnyObject<boolean>>({});

    return (
        <main id='main-list'>
            <header className='page-header main-list-header'>
                <Link to='/setting'>
                    <Icon type='setting' theme='outlined' />
                </Link>
                <Link to='/tags'>
                    <Icon type='tags' theme='outlined' />
                </Link>
                <SortDropMenu />
            </header>
            <article className='main-list-article'>
                {getMangasList(state, sortState).map((item) =>
                    <div
                        key={item.id}
                        className={stringifyClass(['manga-item', {
                            'manga-item__selected': selected[item.id],
                        }])}
                        onClick={() => {
                            setSelected('Replace', {
                                [item.id]: true,
                            });
                        }}>
                        <div className='manga-item__mask'>
                            <div className='manga-item__mask-outside'></div>
                            <div className='manga-item__mask-inside'></div>
                        </div>
                        <img src={item.cachePaths.cover} height='200' />
                    </div>,
                )}
            </article>
        </main>
    );
}
