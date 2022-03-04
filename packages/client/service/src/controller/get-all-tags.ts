import { ServiceData } from './types';
import { TagGroupData } from '@panda/shared';
import { remove, isDef } from '@xiao-ai/utils';

import { getTags, getTagGroups } from '../service/tags';

export const service: ServiceData<TagGroupData[]> = () => {
  const tags = getTags();
  const groups = getTagGroups();

  return groups.map((data) => {
    const innerTags = data.data.tags
      .map((id) => {
        const tag = tags.find((t) => t.id === id);

        if (tag) {
          remove(tags, tag);
          return { ...tag.data };
        }
      })
      .filter(isDef);

    return {
      ...data.data,
      tags: innerTags,
    } as TagGroupData;
  });
};
