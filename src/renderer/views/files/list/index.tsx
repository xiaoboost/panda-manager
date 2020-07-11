import React from 'react';
import styles from './index.styl';

import { useHistory } from 'react-router';
import { FileCoverData } from 'src/utils/typings';
import { stringifyClass } from 'src/utils/web/dom';

export function Render() {
    return (
        <main className={styles.filesList}>
            列表
        </main>
    );
}
