import { basename } from 'path';
import { getRemoteDialog, getRemoteShell } from '@panda/remote/renderer';

export function selectDirectories() {
  return getRemoteDialog()
    .showOpenDialog({
      title: '请选择要添加的文件夹',
      buttonLabel: '确定',
      properties: ['openDirectory', 'multiSelections'],
    })
    .then((data) => data.filePaths ?? []);
}

export function deleteDirectory(dir: string) {
  return getRemoteDialog()
    .showMessageBox({
      message: `确定要删除 ${basename(dir)} 文件夹吗？`,
      detail: '文件夹下所有项目会被删除。',
      type: 'warning',
      defaultId: 0,
      buttons: ['删除', '取消'],
    })
    .then((data) => data.response === 0);
}

export function openPath(path: string) {
  return getRemoteShell().openPath(path);
}
