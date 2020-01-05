import { fsWithBasePath } from '@utils/node/file-hook';

import * as path from 'path';
import * as zip from '@utils/modules/zip';
import * as image from '@utils/modules/image';

import { tempDir, userDir } from './utils';

export function Context(name: string) {
    const baseUserPath = userDir(name);
    const baseTempPath = tempDir(name);

    return {
        path,
        console,
        require: () => void 0,
        fs: fsWithBasePath(baseUserPath),
        tfs: fsWithBasePath(baseTempPath),
        module: {
            exports: {},
        },
        panda: {
            zip,
            image,
        },
    };
}
