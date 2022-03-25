import { SyncService } from './types';
import { NewTagData } from '@panda/shared';
import { addTagByName } from '../service/tags';

export const service: SyncService<NewTagData, void> = ({ requestData }) => {
  return addTagByName(requestData.data);
};
