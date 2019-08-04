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

type Callback = (ev: React.MouseEvent) => void | boolean;

/**
 * 鼠标按键说明
 * @linK https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button
 */
const enum MouseButton {
    left,
    wheel,
    right,
    back,
    ahead,
}

/** 是自身元素触发事件 */
const assertSelf = (ev: React.MouseEvent) => ev.target === ev.currentTarget;
/** 是哪个鼠标按键触发事件 */
const which = (ev: React.MouseEvent, btn: MouseButton) => ev.button === btn;

/** 事件包装器 */
const EventWarpper = (predicate: (ev: React.MouseEvent) => boolean) => {
    return (callback: Callback) => {
        return (ev: React.MouseEvent) => {
            if (predicate(ev)) {
                const result = callback(ev);

                if (result === false) {
                    ev.stopPropagation();
                }
            }
        };
    };
};

/** 必须是自身触发事件 */
export const selfEvent = EventWarpper(assertSelf);

/** 必须是左键触发事件 */
export const leftEvent = EventWarpper((ev) => which(ev, MouseButton.left));

/** 必须是右键触发事件 */
export const rightEvent = EventWarpper((ev) => which(ev, MouseButton.right));

/** 必须是自身且是左键触发事件 */
export const selfLeftEvent = EventWarpper((ev) => assertSelf(ev) && which(ev, MouseButton.left));

/** 必须是右键触发事件 */
export const selfRightEvent = EventWarpper((ev) => assertSelf(ev) && which(ev, MouseButton.right));
