import './index.styl';

import React from 'react';

import { tagGroups } from 'renderer/store';
import { useWatcherList } from 'renderer/use';
import { TagGroup } from 'renderer/lib/tag';

import { Button, Icon } from 'antd';
import { editTagByModal, FormType } from './tag-edit';

import TagGroupComp from './tag-group';

export default function TagCollection() {
    const [groups, { push }] = useWatcherList(tagGroups);
    const createGroup = () => {
        editTagByModal({ type: FormType.TagGroup })
            .then((data) => push(new TagGroup(data)));
    };

    return (
        <main id='tags-collection'>
            {groups.map((item) => <TagGroupComp data={item} key={item.id} />)}
            <Button onClick={createGroup}>
                <Icon type='plus-circle' /> 添加标签集
            </Button>
        </main>
    );
}
