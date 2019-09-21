import { default as React, FunctionComponent } from 'react';

import { shell } from 'electron';
import { warnDialog, selectDirectory } from 'renderer/lib/interface';
import { useWatcher, useCallback, useListCallback } from 'renderer/use';

import Card from './card';
import CardLine from './line';

import { Icon } from 'antd';

import * as store from 'renderer/store';

const DirsList: FunctionComponent<{ dirs: string[] }> = function DirPathList({ dirs }) {
    const remove = (path: string) => {
        warnDialog('确认删除', `确定要删除此文件夹？\n${path}`)
            .then(() => remove(path));
    };

    const removeList = useListCallback(dirs, (dir) => () => remove(dir));
    const openFolder = useListCallback(dirs, (dir) => () => shell.openItem(dir));

    return <>
        {dirs.map((path, i) => (
            <CardLine
                isSubline
                key={i}
                title={path}>
                <Icon
                    style={{
                        color: 'rgba(0, 0, 0, .4)',
                        fontSize: '14px',
                    }}
                    onClick={openFolder[i]}
                    type='folder-open'
                    theme='outlined'
                />
                <Icon
                    style={{
                        color: '#faad14',
                        fontSize: '14px',
                        marginLeft: '8px',
                    }}
                    onClick={removeList[i]}
                    type='delete'
                    theme='outlined'
                />
            </CardLine>
        ))}
    </>;
};

export default function Directories() {
    const [dirs] = useWatcher(store.mangaDirectories);

    /** 添加文件夹 */
    const add = useCallback(() => selectDirectory().then(store.addDirectory), []);

    return (
        <Card title='文件夹'>
            {/** 文件夹列表 */}
            <div className='setting-box'>
                <CardLine
                    title='文件目录'
                    subtitle='目录内的所有 zip 压缩包以及文件夹（不包含子文件夹内容）'>
                    <Icon
                        style={{ fontSize: '20px' }}
                        onClick={add}
                        type='folder-add'
                        theme='outlined'
                    />
                </CardLine>
                {dirs.length === 0
                    ? <CardLine isSubline title='尚未添加目录' />
                    : <DirsList dirs={dirs} />}
            </div>
            {/** 刷新目录 */}
            {/* <CardLine
                title='刷新预览缓存'
                subtitle='刷新目录内有被增、删、改操作的项目'
            /> */}
        </Card>
    );
}
