import React from 'react';

import { TagGroupData } from 'renderer/lib/tag';
import { editTagByModal, FormType } from './tag-edit';

import { Tag, Icon, Dropdown, Menu } from 'antd';

import { useCallback } from 'renderer/use';

interface Props {
    data: TagGroupData;
    onDelete: (id: number) => void;
    onChange: (data: TagGroupData) => void;
}

export default function TagGroup({ data, onChange, onDelete }: Props) {
    const { name, tags } = data;

    /** 删除当前标签集 */
    const deleteSelf = useCallback(() => onDelete(data.id), []);
    /** 编辑当前标签集 */
    const editSelf = useCallback(() => {

    }, [data]);

    const deleteTag = (id: number) => {

    };

    const editTag = (id: number) => {

    };

    const createTag = () => {
        editTagByModal({ type: FormType.Tag }); // .then((data) => push(new TagGroup(data)));
    };

    const GroupMenu = (
        <Menu className='tags-group-menu'>
            <Menu.Item index-data='edit'>
                <a onClick={editSelf}>编辑</a>
            </Menu.Item>
            <Menu.Item index-data='delete'>
                <a onClick={deleteSelf}>删除</a>
            </Menu.Item>
        </Menu>
    );

    return (
        <section className='tags-group-card'>
            <header className='tags-group-card__header'>
                <span className='tags-group-card__title'>{name}</span>
                <Dropdown overlay={GroupMenu} trigger={['click']}>
                    <Icon className='tags-group-card__action' type='bars' />
                </Dropdown>
            </header>
            <article className='tags-group-card__content'>
                {tags.map((tag) =>
                    <Tag
                        key={tag.id}
                        onDoubleClick={() => editTag(tag.id)}
                    >
                        {tag.name} <Icon type='close' onClick={() => deleteTag(tag.id)}/>
                    </Tag>,
                )}
                <Tag
                    onClick={createTag}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                    <Icon type='plus' /> 新标签
                </Tag>
            </article>
        </section>
    );
}
