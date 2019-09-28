import './index.styl';

import React from 'react';

import { mangas } from 'renderer/store';
import { useWatcher, useRouter } from 'renderer/use';

import MangaInfo from './manga-info';
import PreviewList from './preview-list';

interface RouterParam {
    id: string;
}

export default function MangaDetail() {
    const { match } = useRouter<RouterParam>();
    const [origin] = useWatcher(mangas);
    const manga = origin[match.params.id];

    if (!manga) {
        return <div>Loading...</div>;
    }

    return (
        <main id='manga-detail-main'>
            <MangaInfo manga={manga} />
            <PreviewList manga={manga} />
        </main>
    );
}
