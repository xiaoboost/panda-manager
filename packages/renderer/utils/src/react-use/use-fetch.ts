import { useState, useEffect, useRef } from 'react';
import { useMounted } from '@xiao-ai/utils/use';
import { isArray, isBoolean, isUndef, AnyObject } from '@xiao-ai/utils';

import { fetch as fetchService } from '@panda/fetch/renderer';
import { ServiceName } from '@panda/shared';

type FetchResult<T> =
  | {
      fetch: () => Promise<T>;
      progress: number;
      loading: true;
      error: null;
      data: null;
    }
  | {
      fetch: () => Promise<T>;
      progress: number;
      loading: false;
      error: null;
      data: T;
    }
  | {
      fetch: () => Promise<T>;
      progress: number;
      loading: false;
      error: string;
      data: null;
    };

interface UseFetchMethod {
  /**
   * 获取数据
   */
  <T = any>(name: ServiceName): FetchResult<T>;

  /**
   * 获取数据
   *  - immediate 是否立即获取数据
   */
  <T = any>(name: ServiceName, immediate: boolean): FetchResult<T>;

  /**
   * 获取数据
   *  - depends 数组内容变更时会重新获取
   *  - 不会立即获取数据
   */
  <T = any>(name: ServiceName, depends: any[]): FetchResult<T>;

  /**
   * 获取数据
   *  - params 附带数据
   *  - 不会立即获取数据
   */
  <T = any>(name: ServiceName, params: AnyObject): FetchResult<T>;

  /**
   * 获取数据
   *  - params 附带数据
   *  - depends 数组内容变更时会重新获取
   *  - 不会立即获取数据
   */
  <T = any>(name: ServiceName, params: AnyObject, depends: any[]): FetchResult<T>;

  /**
   * 获取数据
   *  - params 附带数据
   *  - immediate 是否立即获取数据
   */
  <T = any>(name: ServiceName, params: AnyObject, immediate: boolean): FetchResult<T>;

  /**
   * 获取数据
   *  - params 附带数据
   *  - depends 数组内容变更时会重新获取
   *  - immediate 是否立即获取数据
   */
  <T = any>(
    name: ServiceName,
    params: AnyObject,
    depends: any[],
    immediate: boolean,
  ): FetchResult<T>;
}

interface PromiseSwitch {
  resolve(arg: any): void;
  reject(arg: any): void;
}

function standard(
  name: ServiceName,
  params?: AnyObject | any[] | boolean,
  depend?: any[] | boolean,
  immediate?: boolean,
) {
  // 一个参数
  if (isUndef(params)) {
    params = {};
    depend = [];
    immediate = false;
  }
  // 两个参数
  else if (isUndef(depend)) {
    if (isBoolean(params)) {
      immediate = params as any;
      params = {};
      depend = [];
    } else if (isArray(params)) {
      depend = params;
      params = {};
      immediate = false;
    } else {
      depend = [];
      immediate = false;
    }
  }
  // 三个参数
  else if (isUndef(immediate)) {
    if (isArray(depend)) {
      immediate = false;
    } else {
      immediate = depend;
      depend = [];
    }
  }

  return [name, params, depend, immediate] as [ServiceName, AnyObject, any[], boolean];
}

export const useFetch: UseFetchMethod = <T>(...args: any[]) => {
  const [name, params, depend, immediate] = standard(...(args as [any, any, any, any]));
  const [loading, setLoading] = useState(immediate);
  const [result, setResult] = useState<null | T>(null);
  const [error, setError] = useState<null | string>(null);
  const [allow, setAllow] = useState(immediate);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const isMounted = useMounted();

  /** 外部 promise 开关 */
  const { current: promise } = useRef<PromiseSwitch>({
    resolve: () => void 0,
    reject: () => void 0,
  });

  // 依赖带上“允许获取”标志位
  const depends = depend.concat([loading, allow]);

  /** 重置状态 */
  function resetState() {
    setAllow(true);
    setLoading(true);
    setResult(null);
    setError(null);
    setProgress(0);
  }

  /** 获取数据 */
  function fetch() {
    fetchService<T>({
      name,
      params,
      onProgress: setProgress,
    })
      .then((data) => {
        if (!isMounted()) {
          return;
        }

        setLoading(false);
        setResult(data.data);
        setProgress(1);
        promise.resolve(data);
      })
      .catch((error: Error) => {
        if (!isMounted()) {
          return;
        }

        setError(error.message);
        setLoading(false);
        setProgress(1);
        promise.reject(error);
      });
  }

  /**
   * 重新获取数据
   *  - 这里并不会直接调用`fetch`函数，而是通过变更`loading`状态触发`useEffect`来实现的，
   *  这么做主要是为了保证是最后才触发调用，确保传进来的`params`是最新的值，而不是旧的值
   */
  function reFetch(): Promise<T> {
    resetState();

    return new Promise((resolve, reject) => {
      promise.reject = reject;
      promise.resolve = resolve;
    });
  }

  useEffect(() => {
    if (allow && loading) {
      fetch();
      setCount(count + 1);
    }
  }, depends);

  return {
    fetch: reFetch,
    loading,
    error,
    progress,
    data: result,
  } as FetchResult<T>;
};
