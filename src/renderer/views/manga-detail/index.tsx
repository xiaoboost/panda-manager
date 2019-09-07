import './index.styl';

import { default as React } from 'react';
import { useMap } from 'react-use';

import { mangas } from 'renderer/store';
import { stringifyClass } from 'utils/web';
import { useWatcher, useRouter } from 'renderer/lib/use';

interface DetailParam {
    id: string;
}

export default function MangaDetail() {
    const { match } = useRouter<DetailParam>();
    const [origin] = useWatcher(mangas);
    const manga = origin[match.params.id];

    return (
        <main id='main-detail'>
            {manga && manga.name}
        </main>
    );
}
