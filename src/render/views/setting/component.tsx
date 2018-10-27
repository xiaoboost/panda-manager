import './component.styl';
import 'antd/lib/icon/style';

import * as React from 'react';
import store from 'store';
import Icon from 'antd/lib/icon';
import { Link } from 'react-router-dom';
import { selectDirectory } from 'lib/com';

interface State {
    directories: string[];
}

export default class ItemDetail extends React.Component<{}, State> {
    state: State = {
        directories: [],
    };

    addDirectory = async () => {
        const directory = await selectDirectory();

        store.addDirectory(directory);
        this.setState({ directories: store.directories.slice() });
    }

    componentWillMount() {
        this.setState({ directories: store.directories.slice() });
    }

    render() {
        return <main id='main-setting'>
            <header className='page-header setting-header'>
                <Link to={'/'}>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>设置</span>
            </header>
            <article className='setting-article'>
                <section className='settings-section'>
                    <header className='settings-title'>文件夹</header>
                    <article className='settings-card'>
                        <div className='settings-line'>
                            <span>
                                <div className='settings-line__name'>包括的文件夹</div>
                                <div className='settings-line__subname'>文件夹内的所有文件夹（不含再次一级文件夹）以及 zip 压缩包</div>
                            </span>
                            <Icon onClick={this.addDirectory} type='folder-add' theme='outlined' />
                        </div>
                        {this.state.directories.map((path) =>
                            <div className='settings-subline'>
                                <div className='settings-line__name'>{path}</div>
                                <Icon type='delete' theme='outlined' />
                            </div>,
                        )}
                    </article>
                </section>
            </article>
        </main>;
    }
}
