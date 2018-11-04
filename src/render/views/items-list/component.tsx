import './component.styl';
import 'antd/lib/icon/style';

import * as React from 'react';
import Icon from 'antd/lib/icon';
import { join } from 'path';
import { Reactive, StoreProps } from 'store';
import { Link, RouteComponentProps } from 'react-router-dom';

type Props = StoreProps & RouteComponentProps;

@Reactive
export default class MainList extends React.Component<Props> {
    render() {
        const { mangas } = this.props.store;

        return <main id='main-list'>
            <header className='page-header main-list-header'>
                <Link to='/setting'>
                    <Icon type='setting' theme='outlined' />
                </Link>
                <span className='page-title'></span>
            </header>
            <article className='main-list-article'>
                {mangas.map((item) =>
                    <div key={item.id} className='manga-item' onClick={() => this.props.history.push(`/detail/${item.id}`)}>
                        <img src={join(item.cachePath, 'cover.jpg')} height='200'/>
                    </div>,
                )}
            </article>
        </main>;
    }
}
