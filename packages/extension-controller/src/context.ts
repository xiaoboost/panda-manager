import { fsLock } from '@utils/node/file-lock';

import * as path from 'path';
import * as zip from '@utils/modules/zip';
import * as image from '@utils/modules/image';

import { tempDir, userDir } from './utils';

const resolve = (base: string) => (...paths: (string | number)[]) => {
    return path.join(base, ...paths.map(String));
};

export function Context(name: string) {
    const baseUserPath = userDir(name.toLowerCase());
    const baseTempPath = tempDir(name.toLowerCase());

    return {
        console,
        require: () => void 0,
        module: {
            exports: {},
        },
        panda: {
            zip,
            image,
            path,
            fs: fsLock({
                write: [baseUserPath, baseTempPath],
            }),
            resolve: {
                userPath: resolve(baseUserPath),
                tempPath: resolve(baseTempPath),
            },
        },
    };
}
