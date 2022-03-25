import { SyncService } from './types';
import { TagGroupData } from '@panda/shared';
import { getTags, getTagGroups } from '../service/tags';

export const service: SyncService<void, TagGroupData[]> = () => {
  const tags = getTags();
  const groups = getTagGroups();

  return groups.map((data) => {
    return {
      ...data.data,
      tags: tags.filter((tag) => tag.data.groupId === data.id).map((tag) => ({ ...tag.data })),
    } as TagGroupData;
  });
};
