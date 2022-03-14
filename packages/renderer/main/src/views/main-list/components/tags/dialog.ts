import { getRemoteDialog } from '@panda/remote/renderer';

export function delateTag(name: string, isGroup: boolean) {
  return getRemoteDialog()
    .showMessageBox({
      message: `确定要删除标签${isGroup ? '集' : ''}“${name}”吗？`,
      detail: isGroup ? '标签集下所有标签都会被删除' : '项目中的此标签均会被删除',
      type: 'warning',
      defaultId: 0,
      buttons: ['删除', '取消'],
      noLink: true,
    })
    .then((data) => data.response === 0);
}
