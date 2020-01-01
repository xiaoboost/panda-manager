import * as fs from '@utils/node/file-system';
import * as image from '@utils/modules/image';

import { tempDir, userDir } from './utils';

import antd from 'antd';

const OriginContext = {
    fs,
    image,
    antd,
    resolvePath: {
        tempDir,
        userDir,
    },
};

export const Context = new Proxy(OriginContext, {
    set() {
        throw new Error('Cann\'t modify extension context.');
    },
});
