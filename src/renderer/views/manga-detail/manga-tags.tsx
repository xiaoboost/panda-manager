import React from 'react';

import { Button, Tag, Icon } from 'antd';

import { isDef } from 'utils/shared';
import { Manga } from 'renderer/lib/manga';
import { tagGroups } from 'renderer/store';

import {
    useCallback,
    useReactive,
} from 'renderer/use';

interface Props {
    manga: Manga;
}

function getTagsById(data: Manga['tagGroups']) {
    const { value: allTags } = tagGroups;
    return data.map((item) => {
        const group = allTags.find(({ id }) => id === item.id);

        if (!group) {
            return undefined;
        }

        return {
            id: group.id,
            name: group.name,
            tags: item.tags
                .map((wait) => group.tags.find(({ id }) => id === wait))
                .filter(isDef),
        };
    }).filter(isDef);
}

export default function PreviewsList({ manga }: Props) {
    const tags = getTagsById(manga.tagGroups);
    const state = useReactive({
        showInput: false,
    });

    const showInput = useCallback(() => (state.showInput = true), []);
    const hiddenInput = useCallback(() => (state.showInput = false), []);

    return (
        <div className='manga-tags'>
            <table>
                <tbody>
                    {tags.map((group) => (
                        <tr key={group.id}>
                            <td className='manga-tags__group'>
                                {group.name}
                            </td>
                            <td className='manga-tags__list'>
                                {group.tags.map(({ id, name }) => (
                                    <Tag key={id}>{name}</Tag>
                                ))}
                            </td>
                        </tr>
                    ))}
                    <tr key='create'>
                        <td className='manga-tags__group'></td>
                        <td className='manga-tags__list'>
                            <Tag
                                onClick={showInput}
                                style={{
                                    background: '#fff',
                                    borderStyle: 'dashed',
                                    paddingTop: '1px',
                                    paddingBottom: '1px',
                                }}
                            >
                                <Icon type='plus' /> 添加标签
                            </Tag>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
