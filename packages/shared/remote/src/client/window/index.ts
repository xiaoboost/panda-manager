import { ipcMain, BrowserWindow } from 'electron';
import { isFunc } from '@xiao-ai/utils';
import { WindowEvent } from './event';
import { log } from '@panda/shared';

import { RemoteEventName, RemoteToEvent, RemoteReplyEvent } from '../../shared/window';

export function initialize(win: BrowserWindow) {
  const subject = new WindowEvent(win);

  ipcMain.on(RemoteEventName, (event, params: RemoteToEvent) => {
    // 非当前窗口事件
    if (win.webContents.id !== event.sender.id) {
      return;
    }

    const result: RemoteReplyEvent = {
      returnValue: undefined,
      isPropertyFunction: false,
      isCalled: true,
    };

    if (process.env.NODE_ENV === 'development') {
      log(`远程窗口请求 Window 模块: ${JSON.stringify(params, null, 2)}`);
    }

    if (isFunc(win[params.key])) {
      result.isCalled = params.callFunction;
      result.isPropertyFunction = true;

      // 允许函数调用则调用函数
      if (params.callFunction) {
        if (params.isEventListener) {
          subject[params.key](params.params?.[0] ?? '');
        } else {
          if (process.env.NODE_ENV === 'development') {
            log(
              `获取远程窗口方法: ${params.key}, ` +
                `参数为: ${JSON.stringify(params.params ?? [], null, 2)}`,
            );
          }

          result.returnValue = win[params.key](...(params.params ?? []));
        }
      }
    } else {
      result.returnValue = win[params.key];
    }

    // 忽略返回值
    if (params.ignoreReturn) {
      result.returnValue = undefined;
    }

    event.returnValue = result;
  });
}
