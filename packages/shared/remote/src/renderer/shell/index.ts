import { ipcRenderer } from 'electron';
import { log } from '@panda/shared';

import { RemoteEventName, RemoteToEvent, RemoteReplyEvent, RemoteShell } from '../../shared/shell';

export type { RemoteShell } from '../../shared/shell';

const remoteShell = new Proxy({} as RemoteShell, {
  get(target, key: string) {
    return async (...params: any[]) => {
      const data: RemoteToEvent = {
        key,
        params,
      };

      if (process.env.NODE_ENV === 'development') {
        log(`请求 Shell 模块，发送参数 - data: ${JSON.stringify(data, null, 2)}`);
      }

      const result: RemoteReplyEvent = await ipcRenderer.invoke(RemoteEventName, data);

      if (process.env.NODE_ENV === 'development') {
        log(`请求 Shell 模块，接收结果 - result: ${JSON.stringify(result, null, 2)}`);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      return result.returnValue;
    };
  },
});

/** 获取远程窗口控制器 */
export function getRemoteShell(): RemoteShell {
  return remoteShell;
}
