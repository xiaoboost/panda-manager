import './index.styl';

import { default as React } from 'react';
import { useMap } from 'react-use';

import { Manga } from 'renderer/lib/manga';
import { mangas } from 'renderer/store';
import { format } from 'utils/shared';
import { stringifyClass } from 'utils/web';
import { useWatcher, useRouter } from 'renderer/lib/use';

import { Button } from 'antd';

import CategorySelector from 'renderer/components/category-selector';

const originHeight = Manga.compressOption.content.size.height + 'px';

export default function MangaDetail() {
    const { match } = useRouter<{ id: string }>();
    const [origin] = useWatcher(mangas);
    const manga = origin[match.params.id];

    if (!manga) {
        return <div>Loading...</div>
    }
    
    const preview = manga.previewPath.replace(/\\/g, '\\\\');

    return (
        <main id='manga-detail-main'>
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
                                    onChange={(val) => console.log(val)}
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
                                    <div>{format(manga.file.lastModified, 'yyyy-MM-dd hh:mm')}</div>
                                    <div>NaN</div>
                                    <div>{manga.previewPositions.length + 1} 页</div>
                                    <div>{manga.file.isDirectory ? '文件夹' : '压缩包'}</div>
                                </div>
                            </div>
                        </div>
                        <div className='manga-tags'></div>
                        <div className='manga-action'>
                            <Button size='small'>浏览漫画</Button>
                            {manga.file.isDirectory ? <Button size='small'>打包漫画</Button> : ''}
                            <Button size='small'>压缩漫画</Button>
                            <Button size='small'>复制到</Button>
                            <Button size='small'>打开文件夹</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card-box' id='manga-previews'>
                {manga.previewPositions.map((width, i, arr) => (
                    <div className='image-block'>
                        <div
                            key={i}
                            className='image-background'
                            style={{
                                backgroundImage: `url('${preview}')`,
                                backgroundPositionY: '0px',
                                backgroundPositionX: `${i === 0 ? 0 : -arr[i - 1]}px`,
                                width: `${i === 0 ? width : width - arr[i - 1]}px`,
                                height: originHeight,
                            }}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}
