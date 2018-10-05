import './component.styl';
import 'antd/lib/button/style';

import * as React from 'react';
import Button from 'antd/lib/button';

import { clone } from 'lib/utils';
import { appCache } from 'lib/cache';
import { MangaData } from 'lib/manga';
import { selectDirectory } from 'lib/com';

interface State {
    mangas: MangaData[];
}

export default class MainList extends React.Component<{}, State> {
    state: State = {
        mangas: clone(appCache.mangas),
    };

    addFolder = async () => {
        const directories = await selectDirectory();

        if (!directories) {
            return;
        }

        await appCache.addDirectory(directories);

        this.setState({
            mangas: clone(appCache.mangas),
        });
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
