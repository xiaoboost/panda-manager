import { app } from 'electron';
import { win, install as installRenderer } from './main';
import { install as installServer } from 'src/server/main';

// 完成初始化时启动主界面
app.on('ready', () => {
    installRenderer();
    installServer();
});

// 所有窗口都被关闭
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 重新激活窗口（macOs）
app.on('activate', () => {
    if (win === null) {
        installRenderer();
    }
});
