import { isFunc } from './assert';
import { AnyFunction } from './types';

/** 延迟函数 */
export function delay(time = 0) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 轮询等待输入函数返回`true`
 * @param {() => boolean} fn 轮询函数
 * @param {number} [interval=200] 轮询间隔
 * @param {number} [stopTimeout=60000] 超时限制时间
 * @returns {Promise<void>}
 */
export function wait(fn: () => boolean, interval = 200, stopTimeout = 60000) {
  let timeout = false;

  const timer = setTimeout(() => (timeout = true), stopTimeout);

  return (function check(): Promise<void> {
    if (fn()) {
      clearTimeout(timer);
      return Promise.resolve();
    }
    else if (!timeout) {
      return delay(interval).then(check);
    }
    else {
      return Promise.resolve();
    }
  })();
}

type ReturnPromiseType<T> = T extends (...args: any) => Promise<infer R>
  ? R
  : T extends (...args: any) => infer R
  ? R
  : any;

/** 防抖动函数包装 */
export function debounce<T extends AnyFunction>(
  cb: T,
  delay = 200,
): (...args: Parameters<T>) => Promise<ReturnPromiseType<T>> {
  let timer: ReturnType<typeof setTimeout>;

  let _resolve: (
    value: ReturnPromiseType<T> | PromiseLike<ReturnPromiseType<T>>,
  ) => void;
  let _reject: (error: any) => void;

  const end = new Promise<ReturnPromiseType<T>>((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  return function delayInDebounce(...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        const result = cb(...args);

        if (result && isFunc(result.then)) {
          result.then(_resolve);
        }
        else {
          _resolve(result);
        }
      }
      catch (e) {
        _reject(e);
      }
    }, delay);

    return end;
  };
}
