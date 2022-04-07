import { SyncService } from './types';
import { NewTagGroupData } from '@panda/shared';
import { addTagGroupByName } from '../service/tags';

export const service: SyncService<NewTagGroupData, void> = ({ requestData }) => {
  return addTagGroupByName(requestData.data);
};
