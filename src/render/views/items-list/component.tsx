import './component.styl';
import 'antd/lib/icon/style';

import * as React from 'react';
import Icon from 'antd/lib/icon';
import { Link } from 'react-router-dom';

import store, { MangaData } from 'src/render/store';
import { clone } from 'lib/utils';

interface State {
    loading: boolean;
    mangas: MangaData[];
}

export default class MainList extends React.Component<{}, State> {
    state: State = {
        loading: false,
        mangas: [],
    };

    async componentWillMount() {
        // 已经读取了缓存
        if (store.isLoaded) {
            this.setState({
                mangas: clone(store.mangas),
            });
        }
        else {
            this.setState({ loading: true });

            await store.readCache();

            this.setState({
                loading: false,
                mangas: clone(store.mangas),
            });
        }
    }

    render() {
        const { mangas } = this.state;

        return <main id='main-list'>
            <header className='page-header main-list-header'>
                <Link to={'/setting'}>
                    <Icon type='setting' theme='outlined' />
                </Link>
            </header>
            <article className='main-list-article'>
                {mangas.map((item) =>
                    <div key={item.id}>{item.name}</div>,
                )}
            </article>
        </main>;
    }
}
