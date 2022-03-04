import { BrowserWindow } from 'electron';
import { ServiceData } from './types';
import { resolveRoot } from '@panda/client-utils';
import { TagGroupData, PatchTagData } from '@panda/shared';
import { remove, isDef } from '@xiao-ai/utils';

import { getTags, getTagGroups } from '../service/tags';
import { open } from '@panda/modal-tag-editor/client';

export const service: ServiceData<void> = async ({ window }) => {
  await open({
    parent: window,
    title: '测试标题',
    initData: {
      title: '测试标题',
    },
  });
};
