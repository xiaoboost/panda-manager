import React from 'react';
import styles from './index.less';

import { shell } from 'electron';
import { useWatcher } from '@utils/react-use';
import { warnDialog, selectDirectory } from '@renderer/lib/dialog';
import { FunctionComponent, useCallback } from 'react';

import * as Config from '@renderer/store/config';
import * as Directory from '@renderer/store/directory';

import { Card, CardLine } from './card';

import {
    FolderOpenOutlined,
    FolderAddOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

interface DirsListProps {
    paths: string[];
    remove(path: string): void;
}

const DirsList: FunctionComponent<DirsListProps> = function DirPathList({ paths, remove }) {
    return <>
        {paths.map((path, i) => (
            <CardLine
                isSubline
                key={i}
                title={path}>
                <FolderOpenOutlined
                    onClick={() => shell.openItem(path)}
                    style={{
                        color: 'rgba(0, 0, 0, .4)',
                        fontSize: '14px',
                    }}
                />
                <DeleteOutlined
                    style={{
                        color: '#faad14',
                        fontSize: '14px',
                        marginLeft: '8px',
                    }}
                    onClick={async () => {
                        await warnDialog({
                            title: '确认删除',
                            content: `确定要删除此文件夹？\n${path}`,
                        });
                        remove(path);
                    }}
                />
            </CardLine>
        ))}
    </>;
};

export function Directories() {
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
                    <FolderAddOutlined
                        style={{ fontSize: '20px' }}
                        onClick={add}
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
