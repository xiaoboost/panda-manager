
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

/** 条件修饰名称 */
export enum ModifierName {
    self,
    left,
    right,
}

/** 修饰断言函数 */
export const Modifier = {
    [ModifierName.self]: (ev: React.MouseEvent) => ev.target === ev.currentTarget,
    [ModifierName.left]: (ev: React.MouseEvent) => ev.button === 0,
    [ModifierName.right]: (ev: React.MouseEvent) => ev.button === 2,
};

/** 是自身元素触发事件 */
const isSelf = (ev: React.MouseEvent) => ev.target === ev.currentTarget;
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
export const selfEvent = EventWarpper(isSelf);

/** 必须是左键触发事件 */
export const leftEvent = EventWarpper((ev) => which(ev, MouseButton.left));

/** 必须是右键触发事件 */
export const rightEvent = EventWarpper((ev) => which(ev, MouseButton.right));

/** 必须是自身且是左键触发事件 */
export const selfLeftEvent = EventWarpper((ev) => isSelf(ev) && which(ev, MouseButton.left));

/** 必须是右键触发事件 */
export const selfRightEvent = EventWarpper((ev) => isSelf(ev) && which(ev, MouseButton.right));

export const warrpper = (assert: string[], callback: Callback) => {

};

warrpper(['self', 'left'], () => {});

onMousedown={createEvent('left', () => {}).add('self', () => {}).add('right,self', () => {})}

onMousedown={createEvent({
    'left': () => {},
    'self': () => {},
    'right,self': () => {},
})}

enum

onMousedown={createEvent('left', () => {}).add('self', () => {}).add('right,self', () => {})}
