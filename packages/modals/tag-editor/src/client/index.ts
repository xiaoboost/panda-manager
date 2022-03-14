import { createModalService } from '@panda/modal-utils/client';
import { resolveRoot } from '@panda/client-utils';
import { FormData, ModalWidth, ModalHeight } from '../shared';

export const open = createModalService<FormData, void>({
  entryFile: resolveRoot('views/tag-editor/index.html'),
  height: ModalHeight,
  width: ModalWidth,
});
