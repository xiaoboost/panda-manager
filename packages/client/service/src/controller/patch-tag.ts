import { SyncService } from './types';
import { PatchTagData } from '@panda/shared';
import { patchTag } from '../service/tags';

export const service: SyncService<PatchTagData, void> = ({ requestData }) => {
  return patchTag(requestData.data);
};
