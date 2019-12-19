import { isFunc } from './assert';

type EventHandler<T = any> = (...payloads: T[]) => any;
type ReadonlyObject<T> = T extends object ? Readonly<T> : T;

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
export class Subject<T> {
    /** 事件数据 */
    private _events: EventHandler<T>[] = [];

    /** 注册观测器 */
    observe(ev: EventHandler<T>) {
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
    unObserve(ev: EventHandler<T>): void;

    unObserve(ev?: EventHandler<T>) {
        if (!ev) {
            this._events = [];
        }
        else {
            this._events = this._events.filter((cb) => cb !== ev);
        }
    }

    /** 发布变化 */
    notify(newVal: T, lastVal: T) {
        this._events.forEach((cb) => cb(newVal, lastVal));
    }
}

/** 监控者 */
export class Watcher<T> extends Subject<T> {
    /** 原始值 */
    protected _data: T;

    get data(): ReadonlyObject<T> {
        return this._data as any;
    }
    set data(val: ReadonlyObject<T>) {
        if (val !== this._data) {
            const last = this._data;

            this._data = val;
            this.notify(val, last);
        }
    }

    constructor(initVal: T) {
        super();
        this._data = initVal;
    }

    /** 只监听一次变化 */
    once() {
        return new Promise<ReadonlyObject<T>>((resolve) => {
            const callback = (val: T) => {
                this.unObserve(callback);
                resolve(val as ReadonlyObject<T>);
            };

            this.observe(callback);
        });
    }
    /** 当值与输入相等时触发 */
    when(val: T | ((item: T) => boolean)) {
        const func = isFunc(val) ? val : (item: T) => item === val;

        if (func(this.data)) {
            return Promise.resolve(this.data);
        }

        return new Promise<ReadonlyObject<T>>((resolve) => {
            const callback = (item: T) => {
                if (func(item)) {
                    this.unObserve(callback);
                    resolve(item as ReadonlyObject<T>);
                }
            };

            this.observe(callback);
        });
    }
}
