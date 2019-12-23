import { use } from './utils';

export * from './types';

export { getModule } from './utils';

export async function createMeta(path: string) {
    // ..
}

export const ready = (() => {
    return Promise.resolve();
})();
