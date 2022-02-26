import { BrowserWindow, Event } from 'electron';
import { ListenerEventName, ListenerEvent } from '../shared';
import { log } from '@panda/shared';

interface EventCache {
  cb(params: any): void;
  count: number;
}

const createCb = (name: string, win: BrowserWindow) => {
  return (_: Event, ...params: any[]) => {
    const data: ListenerEvent = {
      name,
      params,
    };

    if (process.env.NODE_ENV === 'development') {
      log(`Send listener event data: ${JSON.stringify(data, null, 2)}`);
    }

    win.webContents.send(ListenerEventName, data);
  };
};

export class WindowEvent {
  private win: BrowserWindow;
  private map: Record<string, EventCache | undefined> = {};

  constructor(win: BrowserWindow) {
    this.win = win;
  }

  on(name: string) {
    const { win, map } = this;

    if (!name) {
      return;
    }

    if (!map[name]) {
      map[name] = {
        count: 0,
        cb: createCb(name, win),
      };

      win.on(name as any, map[name]!.cb);
    }

    map[name]!.count++;

    if (process.env.NODE_ENV === 'development') {
      log(`Add listener event, name: ${name}, count: ${map[name]!.count}`);
    }
  }

  off(name?: string) {
    const { win, map } = this;

    // TODO: 解除全部绑定
    if (!name) {
      return;
    }

    const data = map[name];

    // 直接退出
    if (!data) {
      return;
    }

    data.count--;

    if (process.env.NODE_ENV === 'development') {
      log(`Remove listener event, name: ${name}, count: ${map[name]!.count}`);
    }

    if (data.count <= 0) {
      win.off(name as any, data.cb);
      delete map[name];
    }
  }

  once(name: string) {
    const { win } = this;
    win.once(name as any, createCb(name, win));
  }

  addListener(name: string) {
    this.on(name);
  }

  removeListener(name: string) {
    return this.off(name);
  }

  removeAllListeners() {
    this.off();
  }
}
