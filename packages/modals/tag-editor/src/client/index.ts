import { createModalService } from '@panda/modal-utils/client';
import { resolveRoot } from '@panda/client-utils';
import { InitData, ModalWidth, ModalHeight } from '../shared';

export const open = createModalService<InitData, void>({
  entryFile: resolveRoot('views/tag-editor/index.html'),
  height: ModalHeight,
  width: ModalWidth,
});
