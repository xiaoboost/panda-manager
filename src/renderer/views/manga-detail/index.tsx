import './index.styl';

import { default as React } from 'react';
import { useMap } from 'react-use';

import { mangas } from 'renderer/store';
import { useWatcher } from 'renderer/lib/use';
import { stringifyClass } from 'utils/web';

export default function MangaDetail() {
    const [manga] = useWatcher(mangas);

    return (
        <main id='main-detail'>
            详细信息
        </main>
    );
}
