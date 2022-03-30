import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, IpcMainEvent } from 'electron';
import { resolveRoot } from '@panda/client-utils';
import { log } from '@panda/shared';
import { ResolveEventName, SendInitDataEventName } from '../shared';

/** 模态框服务选项 */
export interface ModalServiceOptions {
  /** 加载文件入口 */
  entryFile: string;
  /** 模态框高度 */
  height: number;
  /** 模态框宽度 */
  width: number;
}

/** 模态框服务启动选项 */
export interface StartOptions<InitData = any> extends BrowserWindowConstructorOptions {
  /** 初始化数据 */
  initData?: InitData;
}

export function createModalService<Init, Return>({
  entryFile,
  height,
  width,
}: ModalServiceOptions) {
  return function start({ initData, ...opt }: StartOptions<Init>) {
    return new Promise<Return>((resolve) => {
      const win = new BrowserWindow({
        ...opt,
        // 调试时要给调试工具留出空间
        height: process.env.NODE_ENV === 'development' ? height + 400 : height,
        width: process.env.NODE_ENV === 'development' ? width + 400 : width,
        fullscreen: false,
        center: true,
        frame: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        hasShadow: true,
        modal: true,
        autoHideMenuBar: true,
        alwaysOnTop: false,
        webPreferences: {
          ...(opt.webPreferences ?? {}),
          webgl: false,
          enableWebSQL: false,
          nodeIntegration: false,
          contextIsolation: true,
          webSecurity: true,
          safeDialogs: true,
          sandbox: false,
          images: false,
          allowRunningInsecureContent: false,
          preload: resolveRoot('preload/index.js'),
          devTools: process.env.NODE_ENV === 'development',
        },
      });

      win.loadFile(entryFile);

      if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
      }

      function ipcEvent(event: IpcMainEvent, params: any) {
        debugger;

        if (win.webContents.id !== event.sender.id) {
          return;
        }

        resolve(params);
      }

      // 关闭窗口时卸载事件
      win.on('ready-to-show', () => {
        if (process.env.NODE_ENV === 'development') {
          log(`模态框 ${opt.title} 加载完成，并发送初始数据：${JSON.stringify(initData, null, 2)}`);
        }

        win.webContents.send(SendInitDataEventName, initData);
      });

      win.on('close', () => {
        if (process.env.NODE_ENV === 'development') {
          log(`模态框 ${opt.title} 已关闭`);
        }

        ipcMain.off(ResolveEventName, ipcEvent);
      });

      ipcMain.on(ResolveEventName, ipcEvent);
    });
  };
}
