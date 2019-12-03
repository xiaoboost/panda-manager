type EventHandler = (...payloads: any[]) => any;

/** 订阅者 */
export class Subject {
    /** 事件数据 */
    private _events: Record<string, EventHandler[]> = {};

    /** 注册观测器 */
    observe(name: string, ev: EventHandler) {
        const { _events: events } = this;

        if (!events[name]) {
            events[name] = [];
        }

        events[name].push(ev);

        /** 返回取消观测器方法 */
        return function unObserve() {
            events[name] = events[name].filter((cb) => cb !== ev);
        };
    }

    /** 取消全部观测器 */
    unObserve(): void;
    /** 取消此回调的观测器 */
    unObserve(ev: EventHandler): void;
    /** 取消此类全部观测器 */
    unObserve(name: string): void;
    /** 取消此类中的某个回调观测器 */
    unObserve(name: string, ev: EventHandler): void;

    unObserve(name?: string | EventHandler, ev?: EventHandler) {
        // 没有参数输入
        if (!name) {
            this._events = {};
        }
        // 只输入一个参数
        else if (!ev) {
            if (typeof name === 'string') {
                if (this._events[name]) {
                    this._events[name] = [];
                }
            }
            else if (typeof name === 'function') {
                Object.keys(this._events).forEach((key) => {
                    this._events[key] = this._events[key].filter((cb) => cb !== ev);
                });
            }
        }
        // 输入两个参数
        else if (name && ev) {
            const key = name as string;

            if (this._events[key]) {
                this._events[key] = this._events[key].filter((cb) => cb !== ev);
            }
        }
    }

    /** 通知变动 */
    notify(name: string, ...payloads: any[]) {
        const { _events: events } = this;

        if (!events[name]) {
            return;
        }

        events[name].forEach((cb) => cb(...payloads));
    }
}
