import { ipcRenderer } from 'electron';
import { RPC, log } from '@panda/shared';

/** 进程编号 */
export const processId = ipcRenderer.sendSync(RPC.EventName.GetRendererId);

if (process.env.NODE_ENV === 'development') {
  log(`当前渲染进程的编号为: '${processId}'`);
}
