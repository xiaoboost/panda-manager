import React from 'react';

import { format } from 'utils/shared';
import { Manga } from 'renderer/lib/manga';

import MangaActions from './manga-actions';
import CategorySelector from 'renderer/components/category-selector';

interface Props {
    manga: Manga;
}

export default function MangaInfo({ manga }: Props) {
    const { file } = manga;
    const lastModifiedStr = format(file.lastModified, 'yyyy-MM-dd hh:mm');
    const mangaSizeStr = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

    return (
        <div className='card-box' id='manga-detail'>
            <div className='manga-cover'>
                <img src={manga.coverPath} />
            </div>
            <div className='manga-info'>
                <div className='manga-name'>
                    {manga.name}
                </div>
                <div className='manga-meta'>
                    <div className='manga-file'>
                        <div className='manga-category'>
                            <CategorySelector
                                defaultValue={manga.category}
                                onChange={(val) => (manga.category = val)}
                            />
                        </div>
                        <div className='manga-baisc'>
                            <div className='manga-basic-label'>
                                <div>最后修改时间：</div>
                                <div>漫画体积：</div>
                                <div>漫画长度：</div>
                                <div>源文件状态：</div>
                            </div>
                            <div className='manga-basic-value'>
                                <div>{lastModifiedStr}</div>
                                <div>{mangaSizeStr}</div>
                                <div>{manga.previewPositions.length + 1} 页</div>
                                <div>{file.isDirectory ? '文件夹' : '压缩包'}</div>
                            </div>
                        </div>
                    </div>
                    <div className='manga-tags'></div>
                    <MangaActions manga={manga} />
                </div>
            </div>
        </div>
    );
}
