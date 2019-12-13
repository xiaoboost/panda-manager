import { mainSetting } from './index.less';
import { default as React } from 'react';

import Display from './display';
import Directories from './directories';

export default function Setting() {
    return (
        <main id={mainSetting}>
            <Directories />
            <Display />
        </main>
    );
}
