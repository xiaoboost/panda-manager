import { join } from 'path';
import { fileLock } from '@utils/node/file-lock';

import * as image from '@utils/modules/image';

import { tempDir, userDir } from './utils';

export function Context(name: string) {
    const baseTempPath = tempDir(name);
    const baseUserPath = userDir(name);

    const OriginContext = {
        image,
        console,
        fs: fileLock([baseTempPath, baseUserPath]),
        require: () => void 0,
        module: {
            exports: {},
        },
        resolve: {
            userPath(...paths: (string | number)[]) {
                return join(baseTempPath, ...paths.map(String));
            },
            metaPath(...paths: (string | number)[]) {
                return join(baseUserPath, ...paths.map(String));
            },
        },
    };

    return new Proxy(OriginContext, {
        set() {
            throw new Error('Cann\'t modify extension context.');
        },
    });
}
