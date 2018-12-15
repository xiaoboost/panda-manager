import * as React from 'react';

import { Icon } from 'antd';
import { join } from 'path';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Manga, Reactive, Computed, StoreProps } from 'store';

type Props = StoreProps & RouteComponentProps<{ id: string }>;

@Reactive
export default class ItemDetail extends React.Component<Props> {
    @Computed
    get manga() {
        const { match, store } = this.props;
        return store.mangas.find((item) => item.id === match.params.id)!;
    }

    @Computed
    get preview() {
        const { previewPositions: origin }  = this.manga;
        const position: { start: number; width: number }[] = [];

        for (let i = 0; i < origin.length - 1; i++) {
            position.push({
                start: origin[i],
                width: origin[i + 1] - origin[i],
            });
        }

        return position;
    }

    render() {
        if (process.env.NODE_ENV === 'development' && this.props.store.isLoading) {
            return (
                <main id='manga-detail'>
                    <div style={{
                        margin: '20px auto',
                        textAlign: 'center',
                    }} />加载中
                </main>
            );
        }

        const mangaName = this.manga ? this.manga.name : 'ID 不存在';
        const previewImage = join(this.manga.cachePath, 'preview.jpg').replace(/\\/g, '/');
        const previewHeight = Manga.option.compressOption.content.size.height;

        return <main id='manga-detail'>
            <header className='page-header manga-detail-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>{ mangaName }</span>
            </header>
            <article className='manga-detail-article'>
                <section className='manga-info'>
                    漫画信息
                </section>
                <section className='manga-preview'>
                    {this.preview.map(({ start, width }, i) =>
                        <div key={i} className='manga-preview-item'>
                            <div
                                className='manga-preview-item__image'
                                style={{
                                    backgroundImage: `url("file:///${previewImage}")`,
                                    backgroundPositionX: `-${start}px`,
                                    backgroundSize: 'cover',
                                    height: `${previewHeight}px`,
                                    width: `${width}px`,
                                }}
                            />
                        </div>,
                    )}
                </section>
            </article>
        </main>;
    }
}
