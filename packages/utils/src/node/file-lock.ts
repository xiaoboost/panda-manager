import * as fs from './file-system';
import { transArr } from '../shared/array';

export function fileLock(path: string | string[]) {
    const safePath = transArr(path);

    function checkPath(path: string) {
        return safePath.some((safe) => path.indexOf(safe) === 0);
    }

    const fsLock: typeof fs = {} as any;

    Object.keys(fs).forEach((key) => {
        const originVal = fs[key] as any;

        fsLock[key] = (...args: any) => {
            if (!checkPath(args[0])) {
                throw new Error('(fs-lock) illegal path');
            }

            return originVal(...args);
        };
    });

    return fsLock;
}
