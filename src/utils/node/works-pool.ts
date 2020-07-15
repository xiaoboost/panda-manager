import { Worker } from 'worker_threads';
import { cpus } from 'os';

interface WorkerPoolOption {
    /** worker 数量上限 */
    max: number;
    /** worker 闲置时间 */
    timeout: number;
}

const onceMessage = <T = unknown>(worker: Worker) => new Promise<T>((resolve) => {
    worker.once('message', resolve);
});

/** 进程类 */
class WorkerProcess {
    /** 进程原始数据 */
    private readonly _worker: Worker;

    /** 是否繁忙标志 */
    private _busy = false;
    /** 等待空闲 */
    private _freePromise = Promise.resolve<WorkerProcess>(this);
    /** 等待结果 */
    private _resultPromise = Promise.resolve<any>(undefined);

    constructor(path: string) {
        this._worker = new Worker(path);
    }

    get isBusy() {
        return this._busy;
    }
    set isBusy(value: boolean) {
        this._busy = value;
    }

    get id() {
        return this._worker.threadId;
    }

    /**
     * 等待 worker 空闲
     *  - promise 将会返回此 WorkerProcess 本身
     */
    waitFreeWorker(): Promise<WorkerProcess> {
        return this._freePromise;
    }

    /**
     * 等待 worker post 返回
     *  - promise 将会返回上次请求的结果
     */
    waitWorkerResult<T>(): Promise<T> {
        return this._resultPromise;
    }

    /** 对子进程发起请求 */
    async post<T>(name: string, ...params: any[]): Promise<T> {
        this.isBusy = true;

        let freeSwitch!: (worker: WorkerProcess) => void;
        let resultSwitch!: (result: T) => void;

        this._freePromise = new Promise<WorkerProcess>((resolve) => (freeSwitch = resolve));
        this._resultPromise = new Promise<T>((resolve) => (resultSwitch = resolve));

        this._worker.postMessage({
            name,
            params,
        });

        const result = await onceMessage<T>(this._worker);

        this.isBusy = false;

        // 下一个时钟周期触发
        setTimeout(() => {
            freeSwitch(this);
            resultSwitch(result);
        });

        return result;
    }
    /** 销毁当前子进程 */
    destroy() {
        this._worker.terminate();
    }
}

export class WorkerPool {
    /** 选项 */
    private _opt: WorkerPoolOption;
    /** worker 实例 */
    private _workers: WorkerProcess[] = [];
    /** worker 脚本路径 */
    private _path = '';
    /** 结果缓存 */
    private _reuslts: any[] = [];
    /** 当前发出请求的标记 */
    private _sub = 0;

    constructor(path: string, option: Partial<WorkerPoolOption> = {}) {
        this._path = path;
        this._opt = {
            max: option.max || (cpus().length / 4),
            timeout: 10 * 60 * 1000,
        };
    }

    /** 创建新的 worker */
    createWorker() {
        const worker = new WorkerProcess(this._path);

        this._workers.push(worker);

        return worker;
    }

    /** 获取当前空闲 worker */
    async getIdleWorker() {
        // worker 少于最大数量
        if (this._workers.length < this._opt.max) {
            return this.createWorker();
        }

        // 等待空闲
        await Promise.race(this._workers.map(({ waitFreeWorker }) => waitFreeWorker()));

        const idle = this._workers.find((worker) => !worker.isBusy);

        if (idle) {
            return idle;
        }
        else {
            throw new Error('Error idle worker');
        }
    }

    /** 发送请求 */
    async send(name: string, ...params: any[]) {
        const sub = this._sub++;
        const worker = await this.getIdleWorker();

        worker
            .post(name, ...params)
            .then((result) => (this._reuslts[sub] = result));
    }

    /**
     * 获取所有缓存
     *  - 此函数将会等待当前所有请求结束
     */
    async getResult<T>(): Promise<T[]> {
        // 等待所有请求结束
        await Promise.all(this._workers.map(({ waitFreeWorker }) => waitFreeWorker()));

        const results = this._reuslts;

        this._reuslts = [];

        return results;
    }
}
