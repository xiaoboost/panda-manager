import { app } from 'electron';
import { install } from './main';

import { initialize } from '@electron/remote/main';
import { resolveTempDir, remove } from '@panda/client-utils';

// 完成初始化时启动主界面
app.on('ready', () => {
  initialize();
  install();
});

// 所有窗口都被关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  // 清理临时文件夹
  if (process.env.NODE_ENV === 'production') {
    remove(resolveTempDir());
  }
});
