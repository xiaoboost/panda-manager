import './index.styl';

import React from 'react';

import { tagGroups } from 'renderer/store';
import { useWatcherList } from 'renderer/use';
import { TagGroup } from 'renderer/lib/tag';

import { Button, Icon } from 'antd';
import { editTag, FormType } from './tag-edit';

export default function TagCollection() {
    const [groups, { push }] = useWatcherList(tagGroups);
    const addTagGroup = async () => {
        const data = await editTag({ type: FormType.TagGroup });
        push(new TagGroup(data));
    };

    return (
        <main id='tags-collection'>
            {/* {groups.map((group) => <TagsGroup key={group.id} id={group.id} />)} */}
            <Button onClick={addTagGroup}>
                <Icon type='plus-circle' /> 添加标签集
            </Button>
        </main>
    );
}
