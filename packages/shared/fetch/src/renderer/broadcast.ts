import { ipcRenderer } from 'electron';
import { ChannelSubscriber } from '@xiao-ai/utils';
import { log } from '@panda/shared';
import { BroadcastEventName, BroadcastName, BroadcastData } from '../shared';

/** 订阅器 */
export const subscriber = new ChannelSubscriber();

ipcRenderer.on(BroadcastEventName, (ev, params: BroadcastData) => {
  ev.stopPropagation();

  if (process.env.NODE_ENV === 'development') {
    log(
      `前端接收广播数据: ${JSON.stringify(
        {
          ...params,
          name: BroadcastName[params.name],
        },
        null,
        2,
      )}`,
    );
  }

  subscriber.notify(params.name, params);
});
