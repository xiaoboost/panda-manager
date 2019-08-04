import { default as React } from 'react';

import { Link } from 'react-router-dom';
import { Icon } from 'antd';

import { useMap } from 'react-use';
import { useStore } from 'src/renderer/lib/store';
import { sortOption, mangas } from 'src/renderer/store';

import { stringifyClass } from 'src/renderer/lib/utils';
import { selfEvent } from 'src/renderer/lib/event';

import { default as SortDropMenu, getMangasList } from './sort-menu';

export default function MangaList() {
    const [state] = useStore(mangas);
    const [sortState] = useStore(sortOption);
    const [selected, setSelected] = useMap<AnyObject<boolean>>();

    // 漫画点击事件
    function mangaClickHandler(ev: React.MouseEvent) {
        // 左键
        if (ev.button === 0) {

        }
    }

    return (
        <main id='main-list'>
            <header className='page-header main-list-header'>
                <Link to='/setting'>
                    <Icon type='setting' theme='outlined' />
                </Link>
                <Link to='/tags'>
                    <Icon type='tags' theme='outlined' />
                </Link>
                <SortDropMenu />
            </header>
            <article
                className='main-list-article'
                onClick={selfEvent(setSelected.reset)}>
                {getMangasList(state, sortState).map((item) =>
                    <div
                        key={item.id}
                        onClick={mangaClickHandler}
                        className={stringifyClass(['manga-item', {
                            'manga-item__selected': selected[item.id],
                        }])}>
                        <div className='manga-item__mask'>
                            <div className='manga-item__mask-outside'></div>
                            <div className='manga-item__mask-inside'></div>
                        </div>
                        <img src={item.paths.cover} height='200' />
                    </div>,
                )}
            </article>
        </main>
    );
}
