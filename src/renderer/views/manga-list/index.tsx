import './index.styl';

import { default as React } from 'react';
import { useMap } from 'react-use';

import { mangas } from 'renderer/store';
import { useWatcher } from 'renderer/lib/use';
import { stringifyClass } from 'utils/web';

export default function MangaList() {
    const [manga] = useWatcher(mangas);
    const [selected, setSelected] = useMap<AnyObject<boolean>>();
    const mangasList = Object.values(manga);

    return (
        <main id='main-list'>
            {mangasList.map((item) =>
                <div
                    key={item.id}
                    className={stringifyClass('manga-item', {
                        'manga-item__selected': selected[item.id],
                    })}>
                    <div className='manga-item__mask'>
                        <div className='manga-item__mask-outside'></div>
                        <div className='manga-item__mask-inside'></div>
                    </div>
                    <img src={item.coverPath} height='200' />
                </div>,
            )}
        </main>
    );
}
