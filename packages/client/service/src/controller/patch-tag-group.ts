import { SyncService } from './types';
import { PatchTagGroupData } from '@panda/shared';
import { patchTagGroup } from '../service/tags';

export const service: SyncService<PatchTagGroupData, void> = ({ requestData }) => {
  return patchTagGroup(requestData.data);
};
