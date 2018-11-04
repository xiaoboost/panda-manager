import './component.styl';
import 'antd/lib/icon/style';

import * as fs from 'fs-extra';
import * as React from 'react';
import Icon from 'antd/lib/icon';
import { Reactive, Computed, StoreProps } from 'store';
import { Link, RouteComponentProps } from 'react-router-dom';

type Props = StoreProps & RouteComponentProps<{ id: string }>;

@Reactive
export default class ItemDetail extends React.Component<Props> {
    @Computed
    get manga() {
        const { match, store } = this.props;
        return store.mangas.find((item) => item.id === match.params.id);
    }

    render() {
        return <main id='manga-detail'>
            <header className='page-header manga-detail-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>{ this.manga ? this.manga.name : 'ID 不存在' }</span>
            </header>
            <article className='manga-detail-article'>
                详情
            </article>
        </main>;
    }
}
