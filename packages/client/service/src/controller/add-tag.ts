import { BrowserWindow } from 'electron';
import { ServiceData } from './types';
import { resolveRoot } from '@panda/client-utils';
import { TagGroupData, NewTagData, TagKind } from '@panda/shared';
import { remove, isDef } from '@xiao-ai/utils';

import { getTags, getTagGroups } from '../service/tags';
import { open } from '@panda/modal-tag-editor/client';

export const service: ServiceData<void, NewTagData> = async ({ window, requestData }) => {
  await open({
    parent: window,
    title: requestData.data.kind === TagKind.Group ? '新增标签集' : '新增标签',
    initData: {
      name: '',
      comment: '',
      alias: [],
    },
  });
};
