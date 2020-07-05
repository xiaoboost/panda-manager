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
    async post<T>(...args: any[]): Promise<T> {
        this.isBusy = true;

        let freeSwitch!: (worker: WorkerProcess) => void;
        let resultSwitch!: (result: T) => void;

        this._freePromise = new Promise<WorkerProcess>((resolve) => (freeSwitch = resolve));
        this._resultPromise = new Promise<T>((resolve) => (resultSwitch = resolve));

        this._worker.postMessage(args);

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

    constructor(path: string, option: Partial<WorkerPoolOption> = {}) {
        this._path = path;
        this._opt = {
            max: option.max || (cpus().length / 4),
            timeout: 10 * 60 * 1000,
        };
    }

    /** 获取当前空闲 worker */
    async getIdleWorker() {
        // worker 少于最大数量
        if (this._workers.length < this._opt.max - 1) {

        }
        const index = this._idles.findIndex((item) => item);

        if (index >= 0) {
            return this._workers[index];
        }
    }

    createWorker() {
        const worker = new WorkerProcess(this._path);

        this._workers.push(worker);

        return worker;
    }

    async send(params: any) {
        // ..
    }
}
