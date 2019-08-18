/** 延迟函数 */
export function delay(time = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/** 防抖动函数包装 */
export function debounce(cb: () => void, time = 500) {
    let timer: NodeJS.Timeout;

    return function delayInDebounce() {
        clearTimeout(timer);
        timer = setTimeout(cb, time);
    };
}
