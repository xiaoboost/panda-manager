import { AsyncService } from './types';
import { PatchTagMetaData } from '@panda/shared';
import { patchTagGroup, getTagGroups } from '../service/tags';

import { open } from '@panda/modal-tag-editor/client';

export const service: AsyncService<PatchTagMetaData, void> = async ({ requestData }) => {
  const { id } = requestData.data;
  const current = getTagGroups().find((tag) => tag.id === id);

  if (!current) {
    throw new Error(`未发现编号为 ${id} 的标签集`);
  }

  const result = await open({
    initData: {
      title: `修改标签集“${current.data.name}”的元数据`,
      name: current.data.name,
      comment: current.data.comment ?? '',
      alias: current.data.alias ?? [],
    },
    width: 300,
    height: 400,
  });
};
