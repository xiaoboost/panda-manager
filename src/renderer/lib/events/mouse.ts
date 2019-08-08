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

/** 左键触发事件 */
export const left = (ev: React.MouseEvent) => ev.button === MouseButton.left;

/** 右键触发事件 */
export const right = (ev: React.MouseEvent) => ev.button === MouseButton.right;
