import './index.styl';

import { default as React, useCallback } from 'react';
import { useMap } from 'react-use';

import { mangas } from 'renderer/store';
import { useWatcher } from 'renderer/lib/use';
import { stringifyClass } from 'utils/web';

export default function MangaList() {
    const [manga] = useWatcher(mangas);
    const [selected, setSelected] = useMap<AnyObject<boolean>>();
    const mangasList = Object.values(manga);

    const resetHandler = useCallback((ev: React.MouseEvent) => {
        if (ev.currentTarget === ev.target) {
            setSelected.reset();
        }
    }, [selected]);

    return (
        <main id='main-list' onClick={resetHandler}>
            {mangasList.map((item) =>
                <div
                    key={item.id}
                    onClick={() => setSelected.set(item.id, !selected[item.id])}
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
