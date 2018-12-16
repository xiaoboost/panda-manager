import * as React from 'react';

import TagsGroup from './tags-group';

import { Link } from 'react-router-dom';
import { Icon, Button } from 'antd';
import { createId } from 'lib/id';

import { editTag } from 'components/tags-edit';
import { Reactive, StoreProps } from 'store';

@Reactive
export default class TagCollection extends React.Component<StoreProps> {
    addTagGroup = async () => {
        const result = await editTag('创建标签集');

        this.props.store.tagGroups.push({
            ...result,
            id: createId('group'),
            tags: [],
        });
    }

    render() {
        const { tagGroups: groups } = this.props.store;

        return <main id='tag-collection'>
            <header className='page-header tag-collection-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>Tag 聚合</span>
            </header>
            <article className='tag-collection-article'>
                {groups.map((group) => <TagsGroup key={group.id} id={String(group.id)} />)}
                <Button onClick={this.addTagGroup} key='add-button'>
                    <Icon type='plus-circle' />添加标签集
                </Button>
            </article>
        </main>;
    }
}
