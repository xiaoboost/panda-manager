import React from 'react';

import { FolderOpenOutlined } from '@ant-design/icons';
import { unique } from '@xiao-ai/utils';

import { Form, FormItem, List } from '../layout';
import { selectDirectories, deleteDirectory, openPath } from './dialog';

interface Props {
  data: string[];
  patch(dirs: string[]): void;
}

export function Directories({ data, patch }: Props) {
  const addHandler = () => {
    selectDirectories().then((paths) => {
      patch(unique(data.concat(paths)));
    });
  };
  const remove = async (path: string) => {
    const result = await deleteDirectory(path);
    if (result) {
      patch(data.filter((item) => item !== path));
    }
  };

  return (
    <Form title='文件设置'>
      <FormItem
        title='文件夹列表'
        description='列表中所有目录的子项目（不包含再下级的子项目）都将会被包含'
      >
        <List
          data={data}
          addText='添加目录'
          onAdd={addHandler}
          onDelete={(path) => remove(path)}
          action={{
            icon: <FolderOpenOutlined />,
            onClick: (path) => openPath(path),
          }}
        />
      </FormItem>
    </Form>
  );
}
