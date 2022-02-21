import { ipcRenderer } from 'electron';
import { log } from '@panda/shared';
import {
  RemoteWindow,
  EventMethodKey,
  RemoteToEvent,
  RemoteEventName,
  RemoteReplyEvent,
} from '../shared';

const remoteWindow = new Proxy({} as RemoteWindow, {
  get(target, key: string) {
    const isEventListener = EventMethodKey.includes(key);
    const data: RemoteToEvent = {
      key,
      isEventListener,
      callFunction: false,
      ignoreReturn: isEventListener,
    };

    const result: RemoteReplyEvent = ipcRenderer.sendSync(RemoteEventName, data);

    if (process.env.NODE_ENV === 'development') {
      log(`获取窗口属性 - name: ${key}, return: ${JSON.stringify(result, null, 2)}`);
    }

    // 属性是非函数或者属性函数被调用
    if (!result.isPropertyFunction || result.isCalled) {
      return result.returnValue;
    }

    return (...params: any[]) => {
      const data: RemoteToEvent = {
        key,
        params,
        isEventListener,
        callFunction: true,
        ignoreReturn: isEventListener,
      };
      const result: RemoteReplyEvent = ipcRenderer.sendSync(RemoteEventName, data);

      if (process.env.NODE_ENV === 'development') {
        log(`调用窗口方法 - name: ${key}, return: ${JSON.stringify(result, null, 2)}`);
      }

      return result.returnValue;
    };
  },
});

/** 获取远程窗口控制器 */
export function getRemoteWindow(): RemoteWindow {
  return remoteWindow;
}
