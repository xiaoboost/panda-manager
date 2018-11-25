import './component.styl';

import * as React from 'react';

import uuid from 'uuid';
import { Link } from 'react-router-dom';
import { Icon, Button, Dropdown, Menu } from 'antd';

import { editTag } from 'components/tags-edit';
import { confirmDialog } from 'lib/com';
import { Reactive, StoreProps, TagsGroupData } from 'store';

@Reactive
export default class TagCollection extends React.Component<StoreProps> {
    addTagGroup = async () => {
        const result = await editTag('创建标签集');
        const id = uuid();

        this.props.store.tagsGroups[id] = {
            ...result,
            id, tags: [],
        };
    }

    async editTagGroup(data: TagsGroupData) {
        const result = await editTag('编辑标签集', data);
        const { tagsGroups } = this.props.store;

        tagsGroups[data.id] = {
            ...tagsGroups[data.id],
            ...result,
        };

        // TODO: 影响所有的漫画
    }

    async deleteTagGroup(data: TagsGroupData) {
        await confirmDialog(
            '删除确认',
            `确认删除标签集：${data.name}？`,
        );

        delete this.props.store.tagsGroups[data.id];

        // TODO: 所有漫画中需要删除所有记录
    }

    render() {
        const { tagsGroups } = this.props.store;
        const GroupMenu = (data: TagsGroupData) => (
            <Menu className='tags-group-menu'>
                <Menu.Item index-data='edit' onClick={() => this.editTagGroup(data)}>编辑</Menu.Item>
                <Menu.Item index-data='delete' onClick={() => this.deleteTagGroup(data)}>删除</Menu.Item>
            </Menu>
        );

        return <main id='tag-collection'>
            <header className='page-header tag-collection-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>Tag 聚合</span>
            </header>
            <article className='tag-collection-article'>
                <div>
                    {Object.values(tagsGroups).map((item) =>
                        <section className='tags-group-card' key={item.id}>
                            <header>
                                <div className='tags-group-card__header'>
                                    <span className='tags-group-card__title'>{item.name}</span>
                                    <Dropdown overlay={GroupMenu(item)} trigger={['click']}>
                                        <Icon className='tags-group-card__action' type='bars' />
                                    </Dropdown>
                                </div>
                            </header>
                            <article className='tags-group-card__content'>
                                内容
                            </article>
                        </section>,
                    )}
                </div>
                <Button onClick={this.addTagGroup}><Icon type='plus-circle' />添加标签集</Button>
            </article>
        </main>;
    }
}
