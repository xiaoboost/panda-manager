import { AsyncService } from './types';
import { PatchTagMetaData } from '@panda/shared';
import { patchTagGroup, getTagGroups } from '../service/tags';

import { open } from '@panda/modal-tag-editor/client';

export const service: AsyncService<PatchTagMetaData, void> = async ({ window, requestData }) => {
  const { id } = requestData.data;
  const groups = getTagGroups();
  const current = groups.find((tag) => tag.id === id);

  if (!current) {
    throw new Error(`未发现编号为 ${id} 的标签集`);
  }

  const result = await open({
    initData: {
      title: `修改标签集“${current.data.name}”的元数据`,
      name: current.data.name,
      comment: current.data.comment ?? '',
      alias: current.data.alias ?? '',
      groups: groups.map((data) => ({
        id: data.id,
        name: data.data.name,
        alias: data.data.alias ?? '',
      })),
    },
    parent: window,
    width: 300,
    height: 400,
  });
};
