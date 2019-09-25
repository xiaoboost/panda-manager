import React from 'react';

import {
    Tag as MangaTag,
    TagGroup as MangaTagGroup,
    TagData,
    TagGroupData,
} from 'renderer/lib/tag';

import { editTagByModal, FormType } from './tag-edit';

import { Tag, Icon, Dropdown, Menu } from 'antd';

import { deleteConfirm } from 'renderer/lib/dialog';
import { deleteVal, replace } from 'utils/shared';

interface Props {
    data: TagGroupData;
    onDelete: (data: TagGroupData) => void;
    onChange: (data: TagGroupData) => void;
}

export default function TagGroup({ data, onChange, onDelete }: Props) {
    const { name, tags } = data;

    /** 删除当前标签集 */
    const deleteSelf = () => onDelete(data);
    /** 编辑当前标签集 */
    const editSelf = async () => {
        const editData = await editTagByModal({
            type: FormType.TagGroup,
            data,
        });

        const newTag = new MangaTagGroup({
            id: data.id,
            ...editData,
        });

        onChange({
            ...newTag,
            tags,
        });
    };

    /** 删除标签 */
    const deleteTag = async (tag: TagData) => {
        await deleteConfirm({
            okText: '删除',
            content: (
                <span>
                    <span>确认删除此标签？</span>
                    <br />
                    <span style={{ color: '#1890FF', marginTop: '6px', display: 'inline-block' }}>{data.name}</span>
                </span>
            ),
        });

        onChange({
            ...data,
            tags: deleteVal(tags, tag),
        });
    };
    /** 编辑标签 */
    const editTag = async (oldVal: TagData) => {
        const editData = await editTagByModal({
            type: FormType.Tag,
            data: oldVal,
        });

        const newTag = new MangaTag({
            id: oldVal.id,
            ...editData,
        });

        onChange({
            ...data,
            tags: replace(tags, newTag, ({ id }) => id === newTag.id),
        });
    };
    /** 创建标签 */
    const createTag = async () => {
        const editerData = await editTagByModal({ type: FormType.Tag });
        const newTag = new MangaTag(editerData);
        const tagsList = tags.concat([newTag]);

        onChange({
            ...data,
            tags: tagsList,
        });
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
                        onDoubleClick={() => editTag(tag)}
                    >
                        {tag.name} <Icon type='close' onClick={() => deleteTag(tag)}/>
                    </Tag>,
                )}
                <Tag
                    onClick={createTag}
                    className='tags-group__add'
                >
                    <Icon type='plus' /> 新标签
                </Tag>
            </article>
        </section>
    );
}
