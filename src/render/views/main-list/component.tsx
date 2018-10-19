import './component.styl';
import 'antd/lib/button/style';

import * as React from 'react';
import Button from 'antd/lib/button';

import store from 'src/render/store';
import { clone } from 'lib/utils';
import { MangaData } from 'src/render/store/manga';
import { selectDirectory } from 'lib/com';

interface State {
    loading: boolean;
    mangas: MangaData[];
}

export default class MainList extends React.Component<{}, State> {
    state: State = {
        loading: false,
        mangas: [],
    };

    addFolder = async () => {
        const directories = await selectDirectory();

        if (!directories) {
            return;
        }

        await store.addDirectory(directories);

        this.setState({
            mangas: clone(store.mangas),
        });
    }

    componentWillMount() {
        if (!store.isLoaded) {
            store.readCache()
                .then(() => this.setState({ loading: true }));
        }
    }

    render() {
        const { mangas } = this.state;

        return <div id='main-list'>
            <header className='main-list-header'>
                <Button onClick={this.addFolder}>添加文件夹</Button>
            </header>
            <article className='main-list-article'>
                {mangas.map((item) =>
                    <div key={item.id}>{ item.name }</div>,
                )}
            </article>
        </div>;
    }
}
