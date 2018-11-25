import * as React from 'react';

import uuid from 'uuid';
import naturalCompare from 'string-natural-compare';
import TagsGroup from './tags-group';

import { Link } from 'react-router-dom';
import { Icon, Button } from 'antd';

import { editTag } from 'components/tags-edit';
import { Reactive, StoreProps, Computed } from 'store';

@Reactive
export default class TagCollection extends React.Component<StoreProps> {
    @Computed
    get groups() {
        return Object.values(this.props.store.tagsGroups).sort((pre, next) => {
            return naturalCompare(pre.name, next.name);
        });
    }

    addTagGroup = async () => {
        const result = await editTag('创建标签集');
        const id = uuid();

        this.props.store.tagsGroups[id] = {
            ...result,
            id, tags: [],
        };
    }

    render() {
        return <main id='tag-collection'>
            <header className='page-header tag-collection-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>Tag 聚合</span>
            </header>
            <article className='tag-collection-article'>
                {this.groups.map((group) => <TagsGroup key={group.id} id={group.id} />)}
                <Button onClick={this.addTagGroup} key='add-button'><Icon type='plus-circle' />添加标签集</Button>
            </article>
        </main>;
    }
}
