import { ServiceData } from './types';
import { NewTagGroupData } from '@panda/shared';
import { addTagGroupByName } from '../service/tags';

export const service: ServiceData<void, NewTagGroupData> = ({ requestData }) => {
  return addTagGroupByName(requestData.data);
};
