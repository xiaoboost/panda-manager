import './index.styl';

import { default as React, PropsWithChildren } from 'react';

import { Manga } from 'renderer/lib/manga';
import { stringifyClass } from 'utils/web';
import { useRouter } from 'renderer/use';

interface MangaProp {
    data: Manga;
    isSelected: boolean;
    onLeftClick: (ev: React.MouseEvent) => void;
    onRightClick: (ev: React.MouseEvent) => void;
}

export default function MangaCover({
    data: manga,
    isSelected,
    ...handler
}: PropsWithChildren<MangaProp>) {
    const router = useRouter();

    const clickHandler = (ev: React.MouseEvent) => {
        if (ev.button === 0) {
            handler.onLeftClick(ev);
        }
        else if (ev.button === 2) {
            handler.onRightClick(ev);
        }
    };

    const dbClickHandler = (ev: React.MouseEvent) => {
        if (ev.button !== 0) {
            return;
        }

        router.history.push(`/detail/${manga.id}`);
    };

    return (
        <div
            onClick={clickHandler}
            onDoubleClick={dbClickHandler}
            className={stringifyClass('manga-item', {
                'manga-item__selected': isSelected,
            })}>
            <div className='manga-item__mask'>
                <div className='manga-item__mask-outside'></div>
                <div className='manga-item__mask-inside'></div>
            </div>
            <img src={manga.coverPath} height='200' />
        </div>
    );
}
