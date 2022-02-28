import React from 'react';

import { FolderOpenOutlined, FolderAddOutlined, DeleteOutlined } from '@ant-design/icons';

import { style } from './style';
import { unique } from '@xiao-ai/utils';

import { Card, CardLine, CardBox } from '../card';
import { selectDirectories, deleteDirectory, openPath } from '../utils/dialog';

interface DirProps {
  path: string;
  remove(): void;
}

function Directory({ path, remove }: DirProps) {
  return (
    <CardLine isSubLine title={path}>
      <span>
        <FolderOpenOutlined className={style.classes.iconOpen} onClick={() => openPath(path)} />
        <DeleteOutlined className={style.classes.iconDelete} onClick={remove} />
      </span>
    </CardLine>
  );
}

interface AddProps {
  add(path: string[]): void;
}

function AddDirectory({ add }: AddProps) {
  return (
    <CardLine title='文件目录' subtitle='目录内的所有 zip 压缩包以及文件夹（不包含子文件夹内容）'>
      <FolderAddOutlined
        style={{ fontSize: '20px' }}
        onClick={() => selectDirectories().then(add)}
      />
    </CardLine>
  );
}

interface Props {
  data: string[];
  patch(dirs: string[]): void;
}

export function Directories({ data, patch }: Props) {
  const add = (paths: string[]) => patch(unique(data.concat(paths)));
  const remove = async (path: string) => {
    const result = await deleteDirectory(path);
    if (result) {
      patch(data.filter((item) => item !== path));
    }
  };

  return (
    <Card title='文件夹'>
      <CardBox>
        <AddDirectory add={add} />
        {data.length === 0 ? (
          <CardLine isSubLine title='尚未添加目录' />
        ) : (
          data.map((path) => <Directory key={path} path={path} remove={() => remove(path)} />)
        )}
      </CardBox>
    </Card>
  );
}
