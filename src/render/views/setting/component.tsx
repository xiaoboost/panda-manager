import './component.styl';
import 'antd/lib/icon/style';
import 'antd/lib/button/style';

import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';

// import store from 'store';
import { AppCache, Reactive, State, Inject, Computed } from 'store';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { selectDirectory } from 'lib/com';

type Props = { $store: AppCache };

@Inject('$store')
@Reactive
export default class Setting extends React.Component<Props> {
    @Computed
    get loading() {
        return this.props.$store.isLoading;
    }

    @Computed
    get paths() {
        return this.props.$store.directories;
    }

    addDirectory = async () => {
    //     const directory = await selectDirectory();
    //     store.addDirectory(directory);
    }

    UNSAFE_componentWillMount() {
        // setTimeout(() => this.loading = true, 2000);
        // setTimeout(() => this.paths.push('C:\\Project Sources\\Software'), 4000);
        // setTimeout(() => this.loading = false, 5000);
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
                {/** 文件夹部分选项卡 */}
                <section className='settings-section'>
                    <header className='settings-title'>文件夹</header>
                    <article className='settings-card'>
                        {/** 文件夹列表 */}
                        <div className='setting-box'>
                            <div className='settings-line'>
                                <span>
                                    <div className='settings-line__name'>文件目录</div>
                                    <div className='settings-line__subname'>目录内的所有 zip 压缩包以及文件夹（不包含再次一级文件夹）</div>
                                </span>
                                <Icon
                                    onClick={this.addDirectory}
                                    style={{ fontSize: '20px' }}
                                    type='folder-add'
                                    theme='outlined'
                                />
                            </div>
                            {this.paths.length === 0
                                ? <div className='settings-subline'>
                                    <div className='settings-line__name' style={{ textAlign: 'center' }}>尚未添加目录</div>
                                </div>
                                : this.paths.map((path, i) =>
                                    <div className='settings-subline' key={i}>
                                        <div className='settings-line__name'>{path}</div>
                                        <span>
                                            <Icon
                                                style={{
                                                    color: 'rgba(0, 0, 0, .4)',
                                                    fontSize: '14px',
                                                }}
                                                type='folder-open'
                                                theme='outlined'
                                            />
                                            <Icon
                                                style={{
                                                    color: '#faad14',
                                                    fontSize: '14px',
                                                    marginLeft: '8px',
                                                }}
                                                type='delete'
                                                theme='outlined'
                                            />
                                        </span>
                                    </div>,
                                )
                            }
                        </div>
                        {/** 刷新目录 */}
                        <div className='settings-line'>
                            <span>
                                <div className='settings-line__name'>刷新预览缓存</div>
                                <div className='settings-line__subname'>刷新目录内有被增、删、改操作的项目</div>
                            </span>
                            <Button loading={this.loading}>刷新</Button>
                        </div>
                    </article>
                </section>
            </article>
        </main>;
    }
}
