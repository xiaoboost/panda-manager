import AppCache from './cache';

export * from './manga';
export * from './cache';

export { AppCache };

export { observable as State, computed as Computed } from 'mobx';
export { observer as Reactive, inject as Inject } from 'mobx-react';

/** 全局缓存 */
export default new AppCache();
