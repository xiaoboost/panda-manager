import { isDef, isArray, isFunc, isUndef } from '../utils';

type Callback<E extends Event> = React.EventHandler<React.SyntheticEvent<Element, E>>;
type Predicate<E extends Event> = (ev: React.SyntheticEvent<Element, E>) => boolean;

export default class EventBus<E extends Event> {
    /** 内部实际事件队列 */
    private events: Callback<E>[] = [];

    /** 创建事件 */
    create() {
        const EventBusHandler: Callback<E> = (ev) =>{
            this.events.forEach((item) => item(ev));
        };

        return EventBusHandler;
    }

    /** 添加事件 */
    add(cb: Callback<E>): void;
    add(predicate: Predicate<E> | Predicate<E>[], cb: Callback<E>): void;
    add(predicate: Predicate<E> | Predicate<E>[] | Callback<E>, cb?: Callback<E>) {
        // 只输入回调
        if (isUndef(cb) && isFunc(predicate)) {
            this.events.push(predicate);
        }
        // 输入断言函数和回调
        else if (isDef(cb)) {
            if (isArray(predicate)) {
                this.events.push(this.wrap((ev: React.SyntheticEvent<Element, E>) => predicate.every((item) => item(ev)), cb));
            }
            else {
                this.events.push(this.wrap(predicate as Predicate<E>, cb));
            }
        }
    }
    /** 事件包装器 */
    wrap(predicate: Predicate<E>, cb: Callback<E>): Callback<E> {
        return function handlerWrapper(ev: React.SyntheticEvent<Element, E>) {
            if (predicate(ev)) {
                cb(ev);
            }
        };
    }
}
