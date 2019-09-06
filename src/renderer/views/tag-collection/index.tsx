import './index.styl';

import { default as React } from 'react';
import { useMap } from 'react-use';

import { mangas } from 'renderer/store';
import { useWatcher } from 'renderer/lib/use';
import { stringifyClass } from 'utils/web';

export default function TagCollection() {
    const [manga] = useWatcher(mangas);

    return (
        <main id='tag-collection'>
            标签集合
        </main>
    );
}
