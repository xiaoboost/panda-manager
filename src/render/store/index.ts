import AppCache from './cache';
import { IReactComponent, observer, inject } from 'mobx-react';

export * from './manga';
export * from './cache';

export { AppCache };

export { observable as State, computed as Computed } from 'mobx';
export { inject as Inject } from 'mobx-react';

export type StoreProps = { store: AppCache };

export function Reactive<T extends IReactComponent>(target: T): T {
    return inject('store')(observer(target));
}

/** 全局缓存 */
export default new AppCache();