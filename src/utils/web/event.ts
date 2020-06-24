/**
 * 生成一个一次性的事件
 * @param {Element} el
 * @param {string} type
 * @returns {Promise<Event>}
 */
export function onceEvent<T extends Event>(el: Element, type: T['type']): Promise<T> {
    return new Promise((resolve) => {
        el.addEventListener(
            type,
            function once(event: Event) {
                resolve(event as T);
                el.removeEventListener(type, once);
            },
        );
    });
}
