import { ServiceData } from './types';
import { NewTagData } from '@panda/shared';
import { addTagByName } from '../service/tags';

export const service: ServiceData<void, NewTagData> = ({ requestData }) => {
  return addTagByName(requestData.data);
};
