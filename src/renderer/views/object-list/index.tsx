import './index.less';

import { default as React, useState, useEffect } from 'react';

import { ModuleType } from 'renderer/modules';
import { Objects } from 'renderer/store/database';

export default function ItemList() {
    const [objects, setObjects] = useState(Objects.toQuery());

    useEffect(() => {
        return Objects.observe((data) => {
            setObjects(data);
        });
    }, []);

    return (
        <main id='item-list'>
            { JSON.stringify(objects.map(({ data }) => data)) }
        </main>
    );
}
