import React from 'react';
import styles from './index.styl';

import { Render as Display } from './display';
import { Render as Directories } from './directories';

import { useServer } from 'src/utils/react-use';
import { EventName } from 'src/server/renderer';
import { ConfigData } from 'src/utils/typings';

export function Render() {
    const { data } = useServer<ConfigData>(EventName.GetConfig, true);

    return (
        <main id={styles.mainSetting}>
            <Directories paths={data?.directories} />
            <Display sort={data?.sort} />
        </main>
    );
}
