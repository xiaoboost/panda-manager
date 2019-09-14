import './index.styl';

import { default as React } from 'react';
// import { useMap } from 'react-use';

import { Manga } from 'renderer/lib/manga';
import { mangas } from 'renderer/store';
import { format } from 'utils/shared';
// import { stringifyClass } from 'utils/web';
import { useWatcher, useRouter } from 'renderer/lib/use';

import { deleteConfirm } from 'renderer/lib/dialog';
import { selectDirectory } from 'renderer/lib/interface';

import { Button } from 'antd';

import CategorySelector from 'renderer/components/category-selector';

const originHeight = Manga.compressOption.content.size.height + 'px';

export default function MangaDetail() {
    const { match } = useRouter<{ id: string }>();
    const [origin] = useWatcher(mangas);
    const manga = origin[match.params.id];

    if (!manga) {
        return <div>Loading...</div>;
    }

    const { file } = manga;
    const preview = manga.previewPath.replace(/\\/g, '\\\\');
    const extractManga = () => selectDirectory().then((dir) => manga.extract(dir));
    const deleteManga = () => {
        deleteConfirm({
            title: '警告',
            content: `确定要删除此漫画？\n\n${file.path}`,
        })
            .then(() => manga.deleteSelf())
    };

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
                            <Button
                                type='primary'
                                size='small'
                                onClick={manga.viewManga.bind(manga)}>
                                浏览漫画
                            </Button>
                            {file.isDirectory
                                    ? <Button
                                        type='primary'
                                        size='small'
                                        onClick={manga.archive.bind(manga)}>
                                        打包漫画
                                    </Button>
                                    : ''}
                            <Button
                                type='primary'
                                size='small'
                                onClick={extractManga}>
                                {file.isDirectory
                                    ? '复制到'
                                    : '解压到'}
                            </Button>
                            <Button
                                size='small'
                                className='ant-btn-success'
                                onClick={manga.openFolder.bind(manga)}>
                                打开文件夹
                            </Button>
                            <Button
                                size='small'
                                className='ant-btn-warning'>
                                压制漫画
                            </Button>
                            <Button
                                type='danger'
                                size='small'
                                onClick={deleteManga}>
                                删除漫画
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card-box' id='manga-previews'>
                {manga.previewPositions.map((width, i, arr) => (
                    <div className='image-block' key={i}>
                        <div
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
