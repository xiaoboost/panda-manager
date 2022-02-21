import { ipcRenderer } from 'electron';
import { RPC, log } from '@panda/shared';
import { processId } from './utils';

export interface FetchParam {
  /** 事件名称 */
  name: RPC.FetchName;
  /**
   * 进度回调
   *   - `progress`为 0 ~ 100
   */
  onProgress?(progress: number): void;
  /** 参数 */
  params?: any;
}

/** fetch 函数初始化 */
export function fetchInit() {
  ipcRenderer.on(RPC.EventName.ReplyRenderer, (event, params: RPC.FetchData) => {
    debugger;

    // 不是从主进程发送的事件，或者返回数据不是当前进程所有
    if (event.senderId !== 0 || params.rendererId !== processId) {
      return;
    }
  });

  if (process.env.NODE_ENV === 'development') {
    log('fetch 模块初始化');
  }
}

let eventId = 0;

export function fetch<T = any>(param: FetchParam): Promise<RPC.FetchData<T>>;
export function fetch<T = any>(name: RPC.FetchName): Promise<RPC.FetchData<T>>;
export function fetch<T = any>(name: RPC.FetchName, params?: any): Promise<RPC.FetchData<T>>;
export function fetch<T = any>(
  name: RPC.FetchName | FetchParam,
  data?: any,
): Promise<RPC.FetchData<T>> {


  return new Promise<RPC.FetchData<T>>((resolve) => {
    const data: RPC.FetchData = {
      eventId: eventId++,
      rendererId: processId,
      name: name as any,
      data: undefined,
      status: RPC.Status.Created,
    };

    debugger;
    // ipcRenderer.send;
    resolve(data as RPC.FetchData<T>);
  });
}
