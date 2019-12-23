import styles from './index.less';

import { default as React, FunctionComponent } from 'react';

import { shell } from 'electron';
import { Config, Directory } from '../../store';
import { warnDialog, selectDirectory } from '../../lib/dialog';
import { useWatcher, useCallback, useListCallback } from '@utils/react-use';

import Card from './card';
import CardLine from './line';

import { Icon } from 'antd';

interface DirsListProps {
    paths: string[];
    remove(path: string): void;
}

const DirsList: FunctionComponent<DirsListProps> = function DirPathList({ paths, remove }) {
    const openFolder = useListCallback(paths, (dir) => () => shell.openItem(dir));
    const removeList = useListCallback(paths, (dir) => () => {
        warnDialog({
            title: '确认删除',
            content: `确定要删除此文件夹？\n${dir}`,
        }).then(() => remove(dir));
    });

    return <>
        {paths.map((path, i) => (
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
    const [{ directories }] = useWatcher(Config.data);
    const add = useCallback(() => selectDirectory().then(Directory.add), []);
    const remove = useCallback((dir: string) => Directory.remove(dir), []);

    return (
        <Card title='文件夹'>
            {/** 文件夹列表 */}
            <div className={styles.settingBox}>
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
                {directories.length === 0
                    ? <CardLine isSubline title='尚未添加目录' />
                    : <DirsList
                        paths={directories}
                        remove={remove}
                    />}
            </div>
            {/** 刷新目录 */}
            {/* <CardLine
                title='刷新预览缓存'
                subtitle='刷新目录内有被增、删、改操作的项目'
            /> */}
        </Card>
    );
}
