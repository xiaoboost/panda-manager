import './component.styl';
import 'antd/lib/icon/style';
import 'antd/lib/menu/style';
import 'antd/lib/dropdown/style';

import * as React from 'react';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';

import { join } from 'path';
import { Reactive, Computed, StoreProps } from 'store';
import { Link, RouteComponentProps } from 'react-router-dom';

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

        return <main id='main-list'>
            <header className='page-header main-list-header'>
                <Link to='/setting'>
                    <Icon type='setting' theme='outlined' />
                </Link>
                <Dropdown overlay={sortMenu} trigger={['click']}>
                    <Icon type='sort-ascending' theme='outlined' style={{ fontSize: '24px' }} />
                </Dropdown>
            </header>
            <article className='main-list-article'>
                {this.mangas.map((item) =>
                    <div key={item.id} className='manga-item' onDoubleClick={() => this.props.history.push(`/detail/${item.id}`)}>
                        <img src={join(item.cachePath, 'cover.jpg')} height='200'/>
                    </div>,
                )}
            </article>
        </main>;
    }
}
