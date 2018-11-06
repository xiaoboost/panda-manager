import './component.styl';

import * as fs from 'fs-extra';
import * as React from 'react';
import Icon from 'antd/lib/icon';
import { Reactive, StoreProps } from 'store';
import { Link, RouteComponentProps } from 'react-router-dom';

type Props = StoreProps & RouteComponentProps<{ id: string }>;

@Reactive
export default class TagCollection extends React.Component<Props> {
    render() {
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
