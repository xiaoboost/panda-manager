import * as fs from './file-system';

import { join } from 'path';
import { transArr } from '../shared/array';

export function fileLock(path: string | string[]) {
    const safePath = transArr(path);

    function checkPath(path: string) {
        return safePath.some((safe) => path.indexOf(safe) === 0);
    }

    const fsLock: typeof fs = {} as any;

    Object.keys(fs).forEach((key) => {
        const originVal = fs[key] as any;

        fsLock[key] = (...args: any[]) => {
            if (!checkPath(args[0])) {
                throw new Error('(fs-lock) illegal path');
            }

            return originVal(...args);
        };
    });

    return fsLock;
}

export function fsWithBasePath(base: string) {
    const fsWithBase: typeof fs = {} as any;

    Object.keys(fs).forEach((key) => {
        const originVal = fs[key] as any;

        fsWithBase[key] = (...args: any[]) => {
            const inputPath = join('/', args[0]);
            const realPath = join(base, inputPath);
            const newArgs = [realPath, ...args.slice(1)];
            return originVal(...newArgs);
        };
    });

    return fsWithBase;
}
