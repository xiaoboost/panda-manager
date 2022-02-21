import { ChannelSubject, AnyFunction } from '@xiao-ai/utils';
import { log } from '@panda/shared';

export class Subject extends ChannelSubject {
  notify(name: string, ...payloads: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      log(`触发事件, name: ${name}, params: ${JSON.stringify(payloads, null, 2)}`);
    }

    super.notify(name, ...payloads);
  }

  on(name: string, cb: AnyFunction) {
    if (process.env.NODE_ENV === 'development') {
      log(`添加事件监控, name: ${name}`);
    }

    this.observe(name, cb);
  }

  off(name: string, cb: AnyFunction) {
    if (process.env.NODE_ENV === 'development') {
      log(`移除事件监控, name: ${name}`);
    }

    this.unObserve(name, cb);
  }

  once(name: string, cb: AnyFunction) {
    const self = this;

    self.on(name, function once(...params: any[]) {
      cb(...params);
      self.off(name, once);
    });
  }

  addListener(name: string, cb: AnyFunction) {
    this.on(name, cb);
  }

  removeListener(name: string, cb: AnyFunction) {
    this.off(name, cb);
  }

  removeAllListeners() {
    this.unObserve();
  }
}
