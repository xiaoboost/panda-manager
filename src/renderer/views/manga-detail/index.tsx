import './index.styl';

import { default as React } from 'react';
import { useMap } from 'react-use';

import { mangas } from 'renderer/store';
import { format } from 'utils/shared';
import { stringifyClass } from 'utils/web';
import { useWatcher, useRouter } from 'renderer/lib/use';

import CategorySelector from 'renderer/components/category-selector';

export default function MangaDetail() {
    const { match } = useRouter<{ id: string }>();
    const [origin] = useWatcher(mangas);
    const manga = origin[match.params.id];

    if (!manga) {
        return <div>Loading...</div>
    }

    return (
        <main id='main-detail'>
            <div className="manga-details">
                <div className="manga-cover">
                    <img src={manga.coverPath} />
                </div>
                <div className="manga-info">
                    <div className="manga-name">
                        {manga.name}
                    </div>
                    <div className="manga-meta">
                        <div style={{ width: '210px' }}>
                            <div className="manga-category">
                                <CategorySelector
                                    defaultValue={manga.category}
                                    onChange={(val) => console.log(val)}
                                />
                            </div>
                            <div className="manga-baisc">
                                <div className="manga-basic-label">
                                    <div className="manga-basic-label__item">最后修改时间：</div>
                                    <div className="manga-basic-label__item">漫画体积：</div>
                                    <div className="manga-basic-label__item">漫画长度：</div>
                                    <div className="manga-basic-label__item">是否打包：</div>
                                </div>
                                <div className="manga-basic-value">
                                    <div className="manga-basic-value__item">{format(manga.file.lastModified, 'yyyy-MM-dd hh:mm')}</div>
                                    <div className="manga-basic-label__item">NaN</div>
                                    <div className="manga-basic-label__item">{manga.previewPositions.length + 1} 页</div>
                                    <div className="manga-basic-label__item">是/否</div>
                                </div>
                            </div>
                        </div>
                        <div className="manga-tags"></div>
                        <div className="manga-action"></div>
                    </div>
                </div>
            </div>
            <div className="manga-previews">
            </div>
        </main>
    );
}
