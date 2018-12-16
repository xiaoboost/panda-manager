import * as React from 'react';

import { join } from 'path';
import { Icon, Input, Tag } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Manga, Reactive, Computed, StoreProps } from 'store';

import AddTag from './add-tag';

type Props = StoreProps & RouteComponentProps<{ id: string }>;

@Reactive
export default class ItemDetail extends React.Component<Props> {
    @Computed
    get manga() {
        const { match, store } = this.props;
        return store.mangas.find((item) => item.id === +match.params.id)!;
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

    /** 添加标签 */
    addTag = async (id: number) => {
        debugger;
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
        const tagGroups = this.props.store.searchTags(this.manga.tags);

        return <main id='manga-detail'>
            <header className='page-header manga-detail-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>{ mangaName }</span>
            </header>
            <article className='manga-detail-article__container'>
                <div className='manga-detail-article'>
                    <section className='manga-info-box'>
                        <img
                            height='320px'
                            className='mange-cover'
                            src={join(this.manga.cachePath, 'cover.jpg')}
                        />
                        <div className='manga-info'>
                            <Input.TextArea rows={2} value={this.manga.name} />
                        </div>
                    </section>
                    <section className='manga-tags'>
                        {tagGroups.length > 0 && <ul className='manga-tags-list'>
                            {tagGroups.map((group) =>
                                <li className='manga-tag-group'>
                                    <div className='manga-tag-group__name'>{group.name}：</div>
                                    <div className='manga-tag-group__tsg-list'>
                                        {group.tags.map((tag) =>
                                            <span>{tag.name}</span>,
                                        )}
                                    </div>
                                </li>,
                            )}
                        </ul>}
                        <AddTag onInput={this.addTag} />
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
                </div>
            </article>
        </main>;
    }
}
