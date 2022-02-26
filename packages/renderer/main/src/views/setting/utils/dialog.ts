import type {
  OpenDialogOptions,
  MessageBoxOptions,
  MessageBoxReturnValue,
} from 'electron';

import { basename } from 'path';
import { ServiceName } from '@panda/shared';
import { fetch } from '@panda/fetch/renderer';

export function selectDirectories() {
  const data: OpenDialogOptions = {
    title: '请选择要添加的文件夹',
    buttonLabel: '确定',
    properties: ['openDirectory', 'multiSelections'],
  };

  return fetch<string[]>(ServiceName.OpenSelectDialog, data)
    .then(({ data }) => data);
}

export function deleteDirectory(dir: string) {
  const data: MessageBoxOptions = {
    message: `确定要删除 ${basename(dir)} 文件夹吗？`,
    detail: '文件夹下所有项目会被删除。',
    type: 'warning',
    defaultId: 0,
    buttons: ['删除', '取消'],
  };

  return fetch<MessageBoxReturnValue>(ServiceName.OpenMessageDialog, data)
    .then(({ data }) => data.response === 0);
}

export function openPath(path: string) {
  return fetch<void>(ServiceName.OpenPathDefaultManner, {
    path,
  });
}
