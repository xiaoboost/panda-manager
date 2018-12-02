import { onceEvent, remove } from './utils';

/** 全局进程 id 编号 */
let uid = 1;

/** 进程管理器设置接口 */
interface ManagerOption {
    /** 进程数量下限 */
    min: number;
    /** 进程数量上限 */
    max: number;
    /** 空闲进程存在的时间 */
    timeout: number;
}

/** 进程类 */
class WorkerProcess {
    /** 进程原始数据 */
    readonly worker: Worker;
    /** 当前进程所在管理器 */
    readonly manager: ProcessManager;
    /** 每个进程的独立标识符 */
    readonly id = uid++;

    /** 自毁定时器 ID */
    private _timer = -1;
    /** 是否繁忙标志 */
    private _busy = false;
    /** 进程释放事件队列 */
    private readonly _freeEvents: Array<(process: WorkerProcess) => void> = [];

    constructor(manager: ProcessManager) {
        this.manager = manager;
        this.worker = manager.workerCreator();
    }

    get isBusy() {
        return this._busy;
    }
    set isBusy(value: boolean) {
        if (value === this._busy) {
            return;
        }

        this._busy = value;

        // 繁忙标志位置高，清除自毁定时器
        if (value) {
            if (this._timer === -1) {
                return;
            }

            window.clearTimeout(this._timer);
            this._timer = -1;
        }
        // 繁忙标志位置低，设定自毁定时器
        else {
            const { min: limit } = this.manager.options;
            const { length: count } = this.manager.pool;

            // 进程数量少于最小数量，不用销毁
            if (count <= limit) {
                return;
            }

            this._timer = window.setTimeout(
                () => this.destroy(),
                this.manager.options.timeout * 1000,
            );
        }
    }

    /** 对子进程发起请求 */
    async post<T>(...args: any[]): Promise<T> {
        this.isBusy = true;

        this.worker.postMessage(args);

        const { data } = await onceEvent<workerApi.Response<T>>(this.worker, 'message');
        const releaseEvent = this._freeEvents.shift();

        this.isBusy = false;
        releaseEvent && releaseEvent(this);

        return data.result;
    }
    /** 绑定释放进程事件 */
    onRelease(callback: (process: WorkerProcess) => void) {
        this._freeEvents.push(callback);
    }
    /** 销毁当前子进程 */
    destroy() {
        this.worker.terminate();
        this.manager.deleteProcess(this.id);
    }
}

/** 进程管理器 */
export default class ProcessManager {
    /** 管理器参数 */
    options: ManagerOption;

    /** 进程池 */
    readonly pool: WorkerProcess[] = [];
    /** 进程构造函数 */
    readonly workerCreator: workerCreator;

    /** 等待进程 */
    private waitQueue: Promise<WorkerProcess>;

    constructor(worker: workerCreator, opts?: Partial<ManagerOption>) {
        this.options = {
            min: 2,
            max: 4,
            timeout: 60,  // 秒
            ...(opts || {}),
        };

        this.workerCreator = worker;
        this.pool = Array(this.options.min).fill(0).map(() => new WorkerProcess(this));
        this.waitQueue = Promise.resolve(this.pool[0]);
    }

    private async getIdle() {
        const idle = this.pool.find((process) => !process.isBusy);

        // 有空闲进程，则返回该进程
        if (idle) {
            idle.isBusy = true;
            return idle;
        }

        // 进程池未满，则创建新的进程
        if (this.pool.length < this.options.max) {
            const worker = new WorkerProcess(this);

            worker.isBusy = true;
            this.pool.push(worker);

            return worker;
        }

        // 进程池已满
        // 等待进程空闲
        const result = await Promise.race<WorkerProcess>(
            this.pool.map(
                (process) =>
                    new Promise(
                        (resolve) =>
                            process.onRelease(resolve),
                    ),
            ),
        );

        result.isBusy = true;

        return result;
    }

    /** 获取空闲进程 */
    getIdleProcess() {
        return (this.waitQueue = this.waitQueue.then(() => this.getIdle()));
    }

    /** 使用 ID 删除进程 */
    deleteProcess(id: number) {
        remove(this.pool, (process) => process.id === id);
    }
}
