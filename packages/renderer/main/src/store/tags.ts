import { Watcher } from '@xiao-ai/utils';
import { TagGroupData } from '@panda/shared';
import { fetch, ServiceName } from '@panda/fetch/renderer';

export const tagData = new Watcher<TagGroupData[]>([]);

export function fetchTagData() {
  return fetch<TagGroupData[]>(ServiceName.GetAllTags).then(({ data }) => tagData.setData(data));
}

// 初始化获取数据
fetchTagData();
