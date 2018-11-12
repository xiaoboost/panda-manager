import './component.styl';

import * as React from 'react';

import uuid from 'uuid';
import { confirmDialog } from 'lib/com';
import { Link } from 'react-router-dom';
import { Reactive, StoreProps } from 'store';
import { Icon, Button, Dropdown, Menu } from 'antd';

import TagEditer from 'components/tags-edit/component';

// type EditData = Writeable<Pick<TagEditer['props'], 'name' | 'alias' | 'isGroup' | 'isCreate'>>;
type TagGroupData = StoreProps['store']['tagsGroups']['key'];

@Reactive
export default class TagCollection extends React.Component<StoreProps> {
    editer!: TagEditer;

    addTagGroup = async () => {
        const result = await this.editer.setModal();
        const id = uuid();

        this.props.store.tagsGroups[id] = {
            ...result,
            id, tags: [],
        };
    }

    async editTagGroup(data: TagGroupData) {
        const result = await this.editer.setModal({
            name: data.name,
            alias: data.alias,
        });

        const { tagsGroups } = this.props.store;

        tagsGroups[data.id] = {
            ...tagsGroups[data.id],
            ...result,
        };

        // TODO: 影响所有的漫画
    }

    async deleteTagGroup(data: TagGroupData) {
        await confirmDialog(
            '删除确认',
            `确认删除 ${data.name} 标签集？`,
        );

        delete this.props.store.tagsGroups[data.id];

        // TODO: 所有漫画中需要删除所有记录
    }

    render() {
        const { tagsGroups } = this.props.store;
        const saveEditerModal = (editer: TagEditer) => this.editer = editer;
        const GroupMenu = (data: TagGroupData) => (
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

            <TagEditer ref={saveEditerModal} />
        </main>;
    }
}
