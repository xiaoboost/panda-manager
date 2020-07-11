import React from 'react';
import styles from './index.styl';

import { shell } from 'electron';
import { useFollow } from 'src/utils/react-use';
import { deleteVal } from 'src/utils/shared/array';
import { toServer, EventName } from 'src/server/renderer';
import { warn, info, selectDirectory } from 'src/renderer/lib/dialog';

import { Card, CardLine, CardBox } from '../card';

import {
    FolderOpenOutlined,
    FolderAddOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

interface DirProps {
    path: string;
    remove(): void;
}

function Directory({ path, remove }: DirProps) {
    return <CardLine isSubline title={path}>
        <FolderOpenOutlined
            onClick={() => shell.openPath(path)}
            className={styles.directoryIconOpen}
        />
        <DeleteOutlined
            className={styles.directoryIconDelete}
            onClick={remove}
        />
    </CardLine>;
}

interface AddProps {
    add(path: string): any;
}

function AddDirectory({ add }: AddProps) {
    return <CardLine
        title='文件目录'
        subtitle='目录内的所有 zip 压缩包以及文件夹（不包含子文件夹内容）'>
        <FolderAddOutlined
            style={{ fontSize: '20px' }}
            onClick={() => selectDirectory().then(add)}
        />
    </CardLine>;
}

interface Props {
    paths?: string[];
}

export function Render({ paths }: Props) {
    const [dirs, setDirs] = useFollow(paths || []);

    const add = (path: string) => {
        if (dirs.includes(path)) {
            info({
                title: '文件夹重复',
                content: '不可以选择重复文件夹。',
                okText: '关闭',
            });
            return;
        }

        const directories = dirs.concat([path]);

        setDirs(directories);
        toServer(EventName.UpdateConfig, { directories });
    };
    const remove = async (path: string) => {
        await warn({
            title: '删除',
            content: `确定删除该路径吗？该操作是不可逆的。\n${path}`,
            okText: '删除',
            cancelText: '取消',
        });

        const directories = deleteVal(dirs, path, false);

        setDirs(directories);
        toServer(EventName.UpdateConfig, { directories });
    };

    return (
        <Card title='文件夹'>
            {/** 文件夹列表 */}
            <CardBox>
                <AddDirectory add={add} />
                {dirs.length === 0
                    ? <CardLine isSubline title='尚未添加目录' />
                    : dirs.map((path) => <Directory
                        key={path}
                        path={path}
                        remove={() => remove(path)}
                    />)
                }
            </CardBox>
        </Card>
    );
}
