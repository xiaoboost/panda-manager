import './index.styl';

import { default as React, useCallback } from 'react';

import * as store from 'renderer/store';

import { useMap } from 'react-use';
import { Manga } from 'renderer/lib/manga';
import { stringifyClass } from 'utils/web';
import { useWatcher, useRouter } from 'renderer/lib/use';

import stringNaturalCompare from 'string-natural-compare';

export default function MangaList() {
    const [mangas] = useWatcher(store.mangas);
    const [selected, setSelected] = useMap<AnyObject<boolean>>();
    const router = useRouter();

    const sort = store.sortOption.value;
    const sortFunc = (() => {
        const val = Math.pow(-1, Number(!sort.asc));
        // 按照名称排序
        if (sort.by === store.SortBy.name) {
            return (pre: Manga, next: Manga) => val * stringNaturalCompare(pre.name, next.name);
        }
        // 按照最后修改时间排序
        else {
            return (pre: Manga, next: Manga) => {
                return pre.file.lastModified > next.file.lastModified ? val : -1 * val;
            };
        }
    })();

    const mangasList = Object.values(mangas).sort(sortFunc);

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
