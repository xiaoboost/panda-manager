import { ServiceData } from './types';
import { PatchTagGroupData } from '@panda/shared';
import { patchTagGroup } from '../service/tags';

export const service: ServiceData<any, PatchTagGroupData> = ({ requestData }) => {
  return patchTagGroup(requestData.data);
};
