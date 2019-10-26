/** 延迟函数 */
export function delay(time = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 轮询等待输入函数返回`true`
 * @param {() => boolean} fn
 * @param {number} [interval=200]
 * @param {number} [stopTimeout=60000]
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

/** 防抖动函数包装 */
export function debounce<T extends AnyFunction>(cb: T): (...args: Parameters<T>) => void;
export function debounce<T extends AnyFunction>(delay: number, cb: T): (...args: Parameters<T>) => void;
export function debounce<T extends AnyFunction>(delay: number | T, cb?: T): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    let time: number, cbt: T;

    if (typeof delay === 'function') {
        cbt = delay;
        time = 200;
    }
    else {
        cbt = cb as T;
        time = delay;
    }

    return function delayInDebounce(...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => cbt(...args), time);
    };
}
