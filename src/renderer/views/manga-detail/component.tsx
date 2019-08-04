import * as React from 'react';

import { Icon } from 'antd';
import { Link } from 'react-router-dom';

export default function MangaDetail() {
    return (
        <main id='manga-detail'>
            <header className='page-header manga-detail-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>(漫画名称)</span>
            </header>
            <article className='manga-detail-article__container'>
                漫画内容
            </article>
        </main>
    );
}
