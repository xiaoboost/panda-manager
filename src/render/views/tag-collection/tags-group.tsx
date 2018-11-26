import * as React from 'react';

import uuid from 'uuid';

import { remove } from 'lib/utils';
import { editTag } from 'components/tags-edit';
import { confirmDialog } from 'components/dialog';
import { Icon, Dropdown, Menu, Tag } from 'antd';
import { default as Store, ReactiveNoInject, Computed } from 'store';

interface Props {
    id: string;
}

@ReactiveNoInject
export default class TagsGroup extends React.Component<Props> {
    @Computed
    get group() {
        return Store.tagGroups[this.props.id];
    }

    @Computed
    get tags() {
        return this.group.tags.sort((pre, next) => pre.name > next.name ? -1 : 1);
    }

    /** 编辑当前标签集 */
    editTagGroup = async () => {
        const result = await editTag('编辑标签集', this.group);
        const { tagGroups } = Store;
        const { id } = this.group;

        tagGroups[id] = {
            ...tagGroups[id],
            ...result,
        };

        await Store.writeCache();
    }

    /** 删除当前标签集 */
    deleteTagGroup = async () => {
        await confirmDialog(
            <span>删除标签集<Tag>{this.group.name}</Tag></span>,
            '所有漫画中的此标签集都将会被删除\n当前操作无法撤销，确认删除？',
        );

        // TODO: 所有漫画中需要删除所有记录

        delete Store.tagGroups[this.props.id];

        await Store.writeCache();
    }

    /** 创建标签 */
    createTag = async () => {
        const result = await editTag('创建新标签');

        this.group.tags.push({
            ...result,
            id: uuid(),
        });

        await Store.writeCache();
    }

    /** 编辑当前标签 */
    editTag = async (id: string) => {
        const tag = this.group.tags.find((item) => item.id === id)!;
        const result = await editTag('编辑标签', tag);

        Object.assign(tag, result);

        await Store.writeCache();
    }

    /** 删除当前标签 */
    deleteTag = async (id: string) => {
        const tag = this.group.tags.find((item) => item.id === id)!;

        await confirmDialog(
            <span>删除标签<Tag>{this.group.name}:{tag.name}</Tag></span>,
            '所有漫画中的此标签都将会被删除\n当前操作无法撤销，确认删除？',
        );

        remove(this.group.tags, tag);

        // TODO: 所有漫画中需要删除所有记录

        await Store.writeCache();
    }

    render() {
        const { group, tags } = this;
        const GroupMenu = (
            <Menu className='tags-group-menu'>
                <Menu.Item index-data='edit' onClick={this.editTagGroup}>编辑</Menu.Item>
                <Menu.Item index-data='delete' onClick={this.deleteTagGroup}>删除</Menu.Item>
            </Menu>
        );

        return <section className='tags-group-card' key={group.id}>
            <header>
                <div className='tags-group-card__header'>
                    <span className='tags-group-card__title'>{group.name}</span>
                    <Dropdown overlay={GroupMenu} trigger={['click']}>
                        <Icon className='tags-group-card__action' type='bars' />
                    </Dropdown>
                </div>
            </header>
            <article className='tags-group-card__content'>
                {tags.map((tag) =>
                    <Tag
                        key={tag.id}
                        onDoubleClick={() => this.editTag(tag.id)}
                    >
                        {tag.name} <Icon type='close' onClick={() => this.deleteTag(tag.id)}/>
                    </Tag>,
                )}
                <Tag
                    onClick={this.createTag}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                    <Icon type='plus' /> 新标签
                </Tag>
            </article>
        </section>;
    }
}
