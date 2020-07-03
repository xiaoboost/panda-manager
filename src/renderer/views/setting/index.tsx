import React from 'react';
import styles from './index.styl';

import { useState, useEffect } from 'react';

import { Render as Display } from './display';
import { Render as Directories } from './directories';

import { useServer } from 'src/utils/react-use';
import { ConfigData, EventName } from 'src/server/renderer';

export function Render() {
    const { fetch, data } = useServer<ConfigData>(EventName.GetConfig);
    const paths = data?.directories || [];

    return (
        <main id={styles.mainSetting}>
            <Directories paths={paths} update={fetch} />
            <Display />
        </main>
    );
}
