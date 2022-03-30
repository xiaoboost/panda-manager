import { ipcRenderer } from 'electron';
import { log } from '@panda/shared';
import { ExchangeData, ResolveEventName, SendInitDataEventName } from '../../shared';

/** 获取初始数据 */
export async function getInitData<T>() {
  return new Promise<T>((resolve) => {
    ipcRenderer.once(SendInitDataEventName, (_, params: T) => {
      if (process.env.NODE_ENV === 'development') {
        log(`模态框接收到初始数据：${JSON.stringify(params, null, 2)}`);
      }

      resolve(params);
    });
  });
}

/** 返回数据 */
export function resolve<T>(data: ExchangeData<T>) {
  ipcRenderer.send(ResolveEventName, data);

  // 下个周期关闭窗口，确保数据传送
  setTimeout(() => {
    window.close();
  });
}
