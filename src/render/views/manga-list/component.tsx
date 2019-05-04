import { default as React } from 'react';

import { Icon } from 'antd';
import { Link } from 'react-router-dom';

export default function MangaList() {
    return (
        <main id='main-list'>
            <header className='page-header main-list-header'>
                <Link to='/setting'>
                    <Icon type='setting' theme='outlined' />
                </Link>
            </header>
            <article className='main-list-article'>
                漫画列表
            </article>
        </main>
    );
}
