import { app } from 'electron/main';
import { install } from './main';

import { rmrf } from '@panda/fs';
import { resolveTempDir } from './path';

// 完成初始化时启动主界面
app.on('ready', () => {
  install();
});

// 所有窗口都被关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  // 清理临时文件夹
  if (process.env.NODE_ENV === 'production') {
    rmrf(resolveTempDir());
  }
});
