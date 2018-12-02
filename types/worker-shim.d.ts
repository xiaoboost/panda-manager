/** worker 包装器 */
declare type workerCreator = () => Worker;

/** worker 引用定义 */
declare module 'worker-loader!*' {
    const workerCreator: workerCreator;
    export default workerCreator;
}

declare namespace WorkerApi {
    /** 标准数据请求格式 */
    export interface Request<T> extends MessageEvent {
        data: T;
    }

    /** 标准数据返回格式 */
    export interface Response<T> extends MessageEvent {
        data: {
            /** 当前返回状态码 */
            code: string;
            /** 数据集 */
            result: T;
        };
    }
}
