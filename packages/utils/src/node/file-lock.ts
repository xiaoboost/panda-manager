import * as fs from './file-system';

import { join, normalize } from 'path';
import { transArr } from '../shared/array';

const readMethods: Array<keyof typeof fs> = [
    'readJSON', 'stat', 'readFile', 'readdir',
    'exists', 'existsSync', 'fileSize', 'readdirs',
];

const writeMethods: Array<keyof typeof fs> = [
    'rm', 'rmrf', 'mkdirp', 'writeFile',
];

interface LockPermision {
    read?: string | string[];
    write?: string | string[];
}

export function fsLock({ read, write }: LockPermision) {
    const readPath = transArr(read || '*').map(normalize);
    const writePath = transArr(write || '*').map(normalize);
    const fsLock: typeof fs = {} as any;

    function checkPath(paths: string[], input: string) {
        return paths.some((path) => {
            if (path === '*') {
                return true;
            }

            const norInput = normalize(input);
            return path.indexOf(norInput) === 0;
        });
    }

    readMethods.forEach((key: string) => {
        const originVal = fs[key] as any;

        fsLock[key] = (...args: any[]) => {
            if (!checkPath(readPath, args[0])) {
                throw new Error('(fs-lock) illegal path');
            }

            return originVal(...args);
        };
    });

    writeMethods.forEach((key: string) => {
        const originVal = fs[key] as any;

        fsLock[key] = (...args: any[]) => {
            if (!checkPath(writePath, args[0])) {
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
