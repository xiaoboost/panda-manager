import * as React from 'react';

import { Icon } from 'antd';
import { Link } from 'react-router-dom';

export default function TagCollection() {
    return (
        <main id='tag-collection'>
            <header className='page-header tag-collection-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>Tag 聚合</span>
            </header>
            <article className='tag-collection-article'>
                标签列表
            </article>
        </main>
    );
}
