import { join } from 'path';
import { fileLock } from '@utils/node/file-lock';

import * as path from 'path';
import * as zip from '@utils/modules/zip';
import * as image from '@utils/modules/image';

import { tempDir, userDir } from './utils';

export function Context(name: string) {
    const baseTempPath = tempDir(name);
    const baseUserPath = userDir(name);

    const OriginContext = {
        path,
        console,
        require: () => void 0,
        fs: fileLock([baseTempPath, baseUserPath]),
        module: {
            exports: {},
        },
        panda: {
            zip,
            image,
            resolve: {
                tempPath(...paths: (string | number)[]) {
                    return join(baseTempPath, ...paths.map(String));
                },
                userPath(...paths: (string | number)[]) {
                    return join(baseUserPath, ...paths.map(String));
                },
            },
        },
    };

    return new Proxy(OriginContext, {
        set() {
            throw new Error('Cann\'t modify extension context.');
        },
    });
}
