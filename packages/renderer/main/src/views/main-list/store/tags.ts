import { Watcher } from '@xiao-ai/utils';
import { TagGroupData } from '@panda/shared';
import { fetch, ServiceName } from '@panda/fetch/renderer';

export const tagData = new Watcher<TagGroupData[]>([]);

export function fetchTagData() {
  fetch<TagGroupData[]>(ServiceName.GetAllTags).then(({ data }) => tagData.setData(data));
}

fetchTagData();
