import * as React from 'react';
import * as com from 'lib/com';

import { shell } from 'electron';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'antd';
import { Reactive, StoreProps } from 'store';

@Reactive
export default class Setting extends React.Component<StoreProps> {
    /** 选择文件夹 */
    addDirectory = async () => {
        const directory = await com.selectDirectory();
        this.props.store.addDirectory(directory);
    }
    /** 删除文件夹 */
    removeDirectory = async (path: string) => {
        await com.confirmDialog('确认删除', `确定要删除此文件夹？\n${path}`);
        this.props.store.removeDirectory(path);
    }

    render() {
        const { isLoading, directories } = this.props.store;

        return <main id='main-setting'>
            <header className='page-header setting-header'>
                <Link to='/'>
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
                                    <div className='settings-line__subname'>目录内的所有 zip 压缩包以及文件夹（不包含子文件夹内容）</div>
                                </span>
                                <Icon
                                    onClick={this.addDirectory}
                                    style={{ fontSize: '20px' }}
                                    type='folder-add'
                                    theme='outlined'
                                />
                            </div>
                            {directories.length === 0
                                ? <div className='settings-subline'>
                                    <div className='settings-line__name' style={{ textAlign: 'center' }}>尚未添加目录</div>
                                </div>
                                : directories.map((path, i) =>
                                    <div className='settings-subline' key={i}>
                                        <div className='settings-line__name'>{path}</div>
                                        <span>
                                            <Icon
                                                style={{
                                                    color: 'rgba(0, 0, 0, .4)',
                                                    fontSize: '14px',
                                                }}
                                                onClick={() => shell.openItem(path)}
                                                type='folder-open'
                                                theme='outlined'
                                            />
                                            <Icon
                                                style={{
                                                    color: '#faad14',
                                                    fontSize: '14px',
                                                    marginLeft: '8px',
                                                }}
                                                onClick={() => this.removeDirectory(path)}
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
                            <Button loading={isLoading} onClick={() => this.props.store.refreshCache()}>刷新</Button>
                        </div>
                    </article>
                </section>
            </article>
        </main>;
    }
}
