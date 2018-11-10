import './component.styl';

import * as React from 'react';

import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { Reactive, StoreProps } from 'store';

@Reactive
export default class TagCollection extends React.Component<StoreProps> {
    render() {
        const { tagsGroups } = this.props.store;

        return <main id='tag-collection'>
            <header className='page-header tag-collection-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>Tag 聚合</span>
            </header>
            <article className='tag-collection-article'>
                详情
            </article>
        </main>;
    }
}
