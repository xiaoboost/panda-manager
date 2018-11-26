import * as React from 'react';

import { editTag } from 'components/tags-edit';
import { confirmDialog } from 'lib/com';
import { Icon, Button, Dropdown, Menu, Tag } from 'antd';
import { default as Store, ReactiveNoInject, State, Computed, TagData } from 'store';

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

        // TODO: 影响所有的漫画
    }

    /** 删除当前标签集 */
    deleteTagGroup = async () => {
        await confirmDialog(
            '删除确认',
            `确认删除标签集：${this.group.name}？`,
        );

        // TODO: 所有漫画中需要删除所有记录

        delete Store.tagGroups[this.props.id];
    }

    /** 创建标签 */
    createTag() {

    }

    /** 编辑当前标签 */
    editTag = async (id: string) => {

    }

    /** 删除当前标签 */
    deleteTag = async (id: string) => {

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
                    <Tag>{tag.name}</Tag>,
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
