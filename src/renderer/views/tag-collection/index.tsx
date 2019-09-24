import './index.styl';

import React from 'react';

import { tagGroups } from 'renderer/store';
import { useWatcher } from 'renderer/use';
import { TagGroup, TagGroupData } from 'renderer/lib/tag';

import { Button, Icon } from 'antd';
import { deleteConfirm } from 'renderer/lib/dialog';
import { editTagByModal, FormType } from './tag-edit';

import TagGroupComp from './tag-group';

export default function TagCollection() {
    const [groups, setGroup] = useWatcher(tagGroups);

    const createGroup = () => {
        editTagByModal({ type: FormType.TagGroup }).then((data) => {
            setGroup(groups.concat([new TagGroup(data)]));
        });
    };

    const changeGroup = (data: TagGroupData) => {

    };

    const deleteGroup = async (data: TagGroupData) => {
        await deleteConfirm({
            okText: '删除',
            content: (
                <span>
                    <span>确认删除此标签集？</span>
                    <br />
                    <span style={{ color: '#1890FF', marginTop: '6px', display: 'inline-block' }}>{data.name}</span>
                </span>
            ),
        });

        setGroup(groups.filter((item) => item.id !== data.id));
    };

    return (
        <main id='tags-collection'>
            {groups.map((item) => (
                <TagGroupComp
                    data={item}
                    key={item.id}
                    onChange={changeGroup}
                    onDelete={deleteGroup}
                />
            ))}
            <Button onClick={createGroup}>
                <Icon type='plus-circle' /> 添加标签集
            </Button>
        </main>
    );
}
