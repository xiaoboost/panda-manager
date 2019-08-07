/** 是自身元素触发事件 */
export const self = <E extends Event>(ev: React.SyntheticEvent<Element, E>) => ev.target === ev.currentTarget;
