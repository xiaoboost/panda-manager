import './index.styl';

import { default as React } from 'react';

import Directories from './directories';
import Display from './display';

export default function Setting() {
    return (
        <main id='main-setting'>
            <Directories />
            <Display />
        </main>
    );
}
