import { runInNewContext } from 'vm';
import { use } from './utils';

export * from './types';

export { getModule } from './utils';

const ModuleContext = runInNewContext('(Function)', Object.assign(Object.create(null), {
    modules: {
        exports: {},
    },
}));

export async function createMeta(path: string) {
    // ..
}

function getModules(code: string) {
    const subModule = new ModuleContext(
        `${code}; return modules.exports;`,
    )();

    return subModule;
}

export const ready = (() => {
    return Promise.resolve();
})();
