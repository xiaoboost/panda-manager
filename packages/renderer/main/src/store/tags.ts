import { Watcher } from '@xiao-ai/utils';
import { TagGroupData } from '@panda/shared';
import { fetch, ServiceName } from '@panda/fetch/renderer';

export const tagData = new Watcher<TagGroupData[]>([]);

export function fetchTagData() {
  return fetch<TagGroupData[]>(ServiceName.GetAllTags).then(({ data }) => {
    // 调试时需要经常重载页面，页面重载时这里加载需要一定延迟才是正常的
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        tagData.setData(data);
      }, 50);
    } else {
      tagData.setData(data);
    }
  });
}

// 初始化获取数据
fetchTagData();
