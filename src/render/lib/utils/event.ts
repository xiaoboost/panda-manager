/**
 * 生成一个一次性的事件
 * @param {Element} el
 * @param {string} type
 * @returns {Promise<Event>}
 */
export function onceEvent<T extends Event>(el: Element, type: T['type']): Promise<T> {
    const option = {
        passive: true,
        once: true,
    };

    return new Promise<T>((resolve) => {
        el.addEventListener(
            type,
            resolve as any,
            option,
        );
    });
}
