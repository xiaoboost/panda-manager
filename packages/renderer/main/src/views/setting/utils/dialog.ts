import type { OpenDialogOptions } from 'electron';

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

export function openPath(path: string) {
  return fetch<void>(ServiceName.OpenPathDefaultManner, {
    path,
  });
}
