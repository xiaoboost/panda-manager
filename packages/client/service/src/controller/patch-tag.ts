import { ServiceData } from './types';
import { PatchTagData } from '@panda/shared';
import { patchTag } from '../service/tags';

export const service: ServiceData<any, PatchTagData> = ({ requestData }) => {
  return patchTag(requestData.data);
};
