import './index.less';

import React from 'react';

import { useWatcher } from 'utils/react';
import { getModule } from 'renderer/modules';
import { Objects } from 'renderer/store/database';

export default function ItemList() {
    const [rows] = useWatcher(Objects);

    return (
        <main id='item-list'>
            {rows.map(({ data }) => {
                const module = getModule(data.id);

                if (!module) {
                    return '';
                }

                return (
                    <module.ListCover
                        key={data.id}
                        id={data.id}
                        onClick={() => void 0}
                    />
                );
            })}
        </main>
    );
}
