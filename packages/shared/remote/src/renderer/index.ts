import { ipcRenderer } from 'electron';
import { log } from '@panda/shared';
import { Subject } from './event';

import {
  EventMethodKey,
  ListenerEventName,
  ListenerEvent,
  RemoteWindow,
  RemoteToEvent,
  RemoteEventName,
  RemoteReplyEvent,
} from '../shared';

const subject = new Subject();

ipcRenderer.on(ListenerEventName, (_, params: ListenerEvent) => {
  subject.notify(params.name, ...params.params);
});

const remoteWindow = new Proxy({} as RemoteWindow, {
  get(target, key: string) {
    const isEventListener = EventMethodKey.includes(key);
    const data: RemoteToEvent = {
      key,
      isEventListener,
      callFunction: false,
      ignoreReturn: isEventListener,
    };

    if (process.env.NODE_ENV === 'development') {
      log(`获取窗口属性，发送参数 - data: ${JSON.stringify(data, null, 2)}`);
    }

    const result: RemoteReplyEvent = ipcRenderer.sendSync(RemoteEventName, data);

    if (process.env.NODE_ENV === 'development') {
      log(`获取窗口属性，接收结果 - result: ${JSON.stringify(result, null, 2)}`);
    }

    // 属性是非函数或者属性函数被调用
    if (!result.isPropertyFunction || result.isCalled) {
      return result.returnValue;
    }

    return (...params: any[]) => {
      const data: RemoteToEvent = {
        key,
        params: isEventListener ? [params[0]] : params,
        isEventListener,
        callFunction: true,
        ignoreReturn: isEventListener,
      };

      // 注册事件
      if (isEventListener) {
        subject[key](...params);
      }

      if (process.env.NODE_ENV === 'development') {
        log(`调用窗口方法，发送参数 - data: ${JSON.stringify(data, null, 2)}`);
      }

      const result: RemoteReplyEvent = ipcRenderer.sendSync(RemoteEventName, data);

      if (process.env.NODE_ENV === 'development') {
        log(`调用窗口方法，接收结果 - result: ${JSON.stringify(result, null, 2)}`);
      }

      return result.returnValue;
    };
  },
});

/** 获取远程窗口控制器 */
export function getRemoteWindow(): RemoteWindow {
  return remoteWindow;
}
