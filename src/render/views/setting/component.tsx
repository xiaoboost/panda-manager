import React from 'react';

import { Link } from 'react-router-dom';
import { Icon, Button } from 'antd';

import * as store from 'render/store';

import { shell } from 'electron';
import { useStore } from 'render/lib/store';
import { warnDialog, selectDirectory } from 'render/lib/interface';

import {
    addDirectory as add,
    removeDirectory as remove,
    refreshCache as refresh,
} from 'src/render/store';

/** 选项卡片 */
const SettingCard: React.FunctionComponent<{ title: string }> = ({ title, children }) => (
    <section className='settings-section'>
        <header className='settings-title'>{title}</header>
        <article className='settings-card'>{children}</article>
    </section>
);

/** 选项卡片元素属性 */
interface SettingCardLineProps {
    title: string;
    subtitle?: string;
    isSubline?: boolean;
    action?: React.ReactElement;
}

/** 选项卡片元素 */
const SettingCardLine: React.FunctionComponent<SettingCardLineProps> = ({ title, subtitle, isSubline, action }) => (
    <div className={ isSubline ? 'settings-subline' : 'settings-line' }>
        <span>
            <div className='settings-line__name'>{title}</div>
            { subtitle ? <div className='settings-line__subname'>{subtitle}</div> : ''}
        </span>
        {action || ''}
    </div>
);

/** 添加文件夹 */
const addDirectory = () => selectDirectory().then(add);

/** 移除文件夹 */
const removeDirectory = (path: string) => {
    warnDialog('确认删除', `确定要删除此文件夹？\n${path}`)
        .then(() => remove(path));
};

export default function Setting() {
    const [loading] = useStore(store.loading);
    const [dirs] = useStore(store.directories);

    return (
        <main id='main-setting'>
            {/* 标题栏 */}
            <header className='page-header setting-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>设置</span>
            </header>
            <article className='setting-article'>
                {/** 文件夹部分选项卡 */}
                <SettingCard title='文件夹'>
                    {/** 文件夹列表 */}
                    <div className='setting-box'>
                        <SettingCardLine
                            title='文件目录'
                            subtitle='目录内的所有 zip 压缩包以及文件夹（不包含子文件夹内容）'
                            action={
                                <Icon
                                    style={{ fontSize: '20px' }}
                                    onClick={addDirectory}
                                    type='folder-add'
                                    theme='outlined'
                                />
                            }
                        />
                        {dirs.length === 0
                            ? <SettingCardLine isSubline title='尚未添加目录' />
                            : dirs.map((path, i) => (
                                <SettingCardLine
                                    isSubline
                                    key={i}
                                    title={path}
                                    action={<span>
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
                                            onClick={() => removeDirectory(path)}
                                            type='delete'
                                            theme='outlined'
                                        />
                                    </span>}
                                />
                            ))
                        }
                    </div>
                    {/** 刷新目录 */}
                    <SettingCardLine
                        title='刷新预览缓存'
                        subtitle='刷新目录内有被增、删、改操作的项目'
                        action={<Button onClick={refresh} loading={loading}>刷新</Button>}
                    />
                </SettingCard>
            </article>
        </main>
    );
}
