import * as React from 'react';
import { Icon, Menu, Dropdown } from 'antd';

import { join } from 'path';
import { stringifyClass } from 'lib/utils';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Reactive, State, Computed, StoreProps } from 'store';

type Props = StoreProps & RouteComponentProps;
type SortKey = StoreProps['store']['sort']['by'];
type SortListItem = { key: SortKey; label: string };

@Reactive
export default class MainList extends React.Component<Props> {
    /** 排序标准 */
    sortByList: SortListItem[] = [
        { key: 'name', label: '按名称' },
        { key: 'lastModified', label: '按修改时间' },
    ];

    @State
    selectMangas: AnyObject<boolean> = {};

    @Computed
    get mangas() {
        const { mangas, sort } = this.props.store;
        const compare = sort.asc
            ? (pre: number | string, next: number | string) => pre > next ? 1 : -1
            : (pre: number | string, next: number | string) => pre > next ? -1 : 1;

        type Manga = GetArrayItem<typeof mangas>;

        let getValue: (item: Manga) => number | string;

        switch (sort.by) {
            case 'name':
                getValue = (item: Manga) => item.name;
                break;
            case 'lastModified':
                getValue = (item: Manga) => item.file.lastModified;
                break;
            default:
        }

        return mangas.sort((pre, next) => {
            return compare(getValue(pre), getValue(next));
        });
    }

    /** 点击漫画 */
    clickMangaHandler(event: React.MouseEvent<HTMLDivElement>, id: string) {
        // 停止冒泡
        event.stopPropagation();

        // 点击漫画已经被选中
        if (this.selectMangas[id]) {
            return;
        }

        // TODO: 用键盘的 shift 和 ctrl 多选
        this.selectMangas[id] = true;
    }

    /** 点击空白 */
    clickSpaceHandler(event: React.MouseEvent<HTMLElement>) {
        // 停止冒泡
        event.stopPropagation();
        // 必须是自身
        if (event.currentTarget !== event.target) {
            return;
        }

        this.selectMangas = {};
    }

    render() {
        const { sort } = this.props.store;
        const sortMenu = (
            <Menu id='sort-menu'>
                {this.sortByList.map(({ key, label }) =>
                    <Menu.Item key={key} onClick={() => sort.by = key}>
                        {sort.by === key
                            ? <Icon type='check' theme='outlined' />
                            : <i className='anticon' />
                        }
                        <span>{label}</span>
                    </Menu.Item>,
                )}
                <Menu.Divider />
                {[true, false].map((asc) =>
                    <Menu.Item key={+asc} onClick={() => sort.asc = asc}>
                        {sort.asc === asc
                            ? <Icon type='check' theme='outlined' />
                            : <i className='anticon' />
                        }
                        <span>{asc ? '顺序' : '倒序'}</span>
                    </Menu.Item>,
                )}
            </Menu>
        );

        return <main id='main-list' onClick={(e) => this.clickSpaceHandler(e)}>
            <header className='page-header main-list-header'>
                <Link to='/setting'>
                    <Icon type='setting' theme='outlined' />
                </Link>
                <Link to='/tags'>
                    <Icon
                        type='tags'
                        theme='outlined'
                        style={{
                            fontSize: '20px',
                            top: '2px',
                            left: '2px',
                        }}
                    />
                </Link>
                <Dropdown overlay={sortMenu} trigger={['click']}>
                    <Icon type='sort-ascending' theme='outlined' style={{ fontSize: '24px' }} />
                </Dropdown>
            </header>
            <article className='main-list-article'>
                {this.mangas.map((item) =>
                    <div
                        key={item.id}
                        className={stringifyClass([
                            'manga-item',
                            {
                                'manga-item__selected': this.selectMangas[item.id],
                            },
                        ])}
                        onClick={(e) => this.clickMangaHandler(e, item.id)}
                        onDoubleClick={() => this.props.history.push(`/detail/${item.id}`)}>
                        <img src={join(item.cachePath, 'cover.jpg')} height='200'/>
                    </div>,
                )}
            </article>
        </main>;
    }
}
