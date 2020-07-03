import React from 'react';
import styles from './index.styl';

import { shell } from 'electron';
import { warnDialog, selectDirectory } from 'src/renderer/lib/dialog';
import { toServer, EventName } from 'src/server/renderer';
import { deleteVal } from 'src/utils/shared/array';

import { Card, CardLine } from '../card';

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
    paths: string[];
    update(): void;
}

export function Render({ paths, update }: Props) {
    const add = (path: string) => {
        toServer(EventName.UpdateConfig, {
            directories: paths.concat([path]),
        }).then(update);
    };

    const remove = (path: string) => {
        toServer(EventName.UpdateConfig, {
            directories: deleteVal(paths, path),
        }).then(update);
    };

    return (
        <Card title='文件夹'>
            {/** 文件夹列表 */}
            <div className={styles.settingBox}>
                <AddDirectory add={add} />
                {paths.length === 0
                    ? <CardLine isSubline title='尚未添加目录' />
                    : paths.map((path) => <Directory
                        key={path}
                        path={path}
                        remove={() => remove(path)}
                    />)
                }
            </div>
        </Card>
    );
}
