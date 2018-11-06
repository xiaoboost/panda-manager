import AppCache from './cache';
import { IReactComponent, observer, inject } from 'mobx-react';

export * from './manga';
export * from './cache';

export { AppCache };
export { inject as Inject } from 'mobx-react';
export { observable as State, computed as Computed } from 'mobx';

export type StoreProps = { store: AppCache };

export function Reactive<T extends IReactComponent>(target: T): T {
    return inject('store')(observer(target));
}

const store = new AppCache();

// 缓存初始化
store.readCache();

/** 全局缓存 */
export default store;
