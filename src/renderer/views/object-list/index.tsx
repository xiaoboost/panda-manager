import './index.less';

import React from 'react';

import { useWatcher } from 'utils/react';
import { Objects } from 'renderer/store/database';

export default function ItemList() {
    const [objects] = useWatcher(Objects);

    return (
        <main id='item-list'>
            { JSON.stringify(objects.map(({ data }) => data)) }
        </main>
    );
}
