import './component.styl';
import 'antd/lib/icon/style';

import * as React from 'react';
import Icon from 'antd/lib/icon';
import { join } from 'path';
import { Link } from 'react-router-dom';
import { Reactive, StoreProps } from 'store';

@Reactive
export default class MainList extends React.Component<StoreProps> {
    render() {
        const { isLoading, mangas } = this.props.store;

        return <main id='main-list'>
            <header className='page-header main-list-header'>
                <Link to={'/setting'}>
                    <Icon type='setting' theme='outlined' />
                </Link>
            </header>
            <article className='main-list-article'>
                {mangas.map((item) =>
                    <div key={item.id} className='manga-item'>
                        <img src={join(item.cachePath, 'cover.jpg')} height='200'/>
                    </div>,
                )}
            </article>
        </main>;
    }
}
