import './index.styl';

import { default as React, PropsWithChildren, memo } from 'react';

import { Icon, Button } from 'antd';

import * as store from 'renderer/store';

import { shell } from 'electron';
import { useWatcher } from 'renderer/lib/use';
import { warnDialog, selectDirectory } from 'renderer/lib/interface';

import {
    addDirectory as add,
    removeDirectory as remove,
    refreshCache as refresh,
} from 'renderer/store';

/** 选项卡片 */
function SettingCard(props: PropsWithChildren<{ title: string }>) {
    return (
        <section className='settings-section'>
            <header className='settings-title'>{props.title}</header>
            <article className='settings-card'>{props.children}</article>
        </section>
    );
}

/** 选项卡片元素属性 */
interface SettingCardLineProps {
    title: string;
    subtitle?: string;
    isSubline?: boolean;
    action?: React.ReactElement;
}

/** 选项卡片元素 */
function SettingCardLine(props: SettingCardLineProps) {
    return <div className={ props.isSubline ? 'settings-subline' : 'settings-line' }>
        <span>
            <div className='settings-line__name'>{props.title}</div>
            { props.subtitle ? <div className='settings-line__subname'>{props.subtitle}</div> : ''}
        </span>
        {props.action || ''}
    </div>;
};

/** 文件夹列表 */
const DirPathList = memo(function DirPathList(props: { dirs: string[] }) {
    return <>
        {props.dirs.map((path, i) => (
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
        ))}
    </>;
});

/** 添加文件夹 */
const addDirectory = () => selectDirectory().then(add);

/** 移除文件夹 */
const removeDirectory = (path: string) => {
    warnDialog('确认删除', `确定要删除此文件夹？\n${path}`)
        .then(() => remove(path));
};

export default function Setting() {
    const [loading] = useWatcher(store.reading);
    const [dirs] = useWatcher(store.mangaDirectories);

    return (
        <main id='main-setting'>
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
                        : <DirPathList dirs={dirs} />
                    }
                </div>
                {/** 刷新目录 */}
                <SettingCardLine
                    title='刷新预览缓存'
                    subtitle='刷新目录内有被增、删、改操作的项目'
                    action={<Button onClick={refresh} loading={loading}>刷新</Button>}
                />
            </SettingCard>
        </main>
    );
}
