type EventHandler = (...payloads: any[]) => any;

/** 频道订阅者 */
export class ChannelSubject {
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

    /** 发布变化 */
    notify(name: string, ...payloads: any[]) {
        const { _events: events } = this;

        if (!events[name]) {
            return;
        }

        events[name].forEach((cb) => cb(...payloads));
    }
}

/** 订阅者 */
export class Subject {
    /** 事件数据 */
    private _events: EventHandler[] = [];

    /** 注册观测器 */
    observe(ev: EventHandler) {
        /** 注销观测器 */
        const unObserve = () => {
            this._events = this._events.filter((cb) => cb !== ev);
        };
        
        // 添加观测器
        this._events.push(ev);

        return unObserve;
    }

    /** 注销全部观测器 */
    unObserve(): void;
    /** 注销此回调的观测器 */
    unObserve(ev: EventHandler): void;

    unObserve(ev?: EventHandler) {
        if (!ev) {
            this._events = [];
        }
        else {
            this._events = this._events.filter((cb) => cb !== ev);
        }
    }

    /** 发布变化 */
    notify<T = any>(newVal: T, lastVal: T) {
        this._events.forEach((cb) => cb(newVal, lastVal));
    }
}
