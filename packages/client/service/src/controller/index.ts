import { service as ready } from './ready';
import { service as getConfig } from './get-config';
import { service as patchConfig } from './patch-config';
import { service as openAboutModal } from './open-about-modal';
import { service as openSelectDialog } from './open-select-dialog';
import { service as openPathDefaultManner } from './open-path-default-manner';
import { service as openMessageDialog } from './open-message-dialog';
import { service as getAllTags } from './get-all-tags';
import { service as addTag } from './add-tag';

import { ServiceData } from './types';
import { Status, FetchData, ListenerContext, ServiceName } from '@panda/fetch/client';

const serviceMap: Record<ServiceName, ServiceData | undefined> = {
  [ServiceName.Ready]: ready,
  [ServiceName.GetConfig]: getConfig,
  [ServiceName.PatchConfig]: patchConfig,
  [ServiceName.GetItemsList]: undefined,
  [ServiceName.GetItemDetail]: undefined,
  [ServiceName.OpenPathDefaultManner]: openPathDefaultManner,
  [ServiceName.OpenAboutModal]: openAboutModal,
  [ServiceName.OpenSelectDialog]: openSelectDialog,
  [ServiceName.OpenMessageDialog]: openMessageDialog,
  [ServiceName.GetAllTags]: getAllTags,
  [ServiceName.AddTag]: addTag,
  [ServiceName.AddTagGroup]: addTag,
  [ServiceName.PatchTag]: undefined,
  [ServiceName.PatchTagGroup]: undefined,
  [ServiceName.PatchTagMeta]: undefined,
  [ServiceName.PatchTagGroupMeta]: undefined,
  [ServiceName.MoveTag]: undefined,
  [ServiceName.DeleteTag]: undefined,
  [ServiceName.DeleteTagGroup]: undefined,
};

export async function service(context: ListenerContext): Promise<FetchData> {
  const result = { ...context.requestData };
  const func = serviceMap[result.name];

  if (func) {
    result.data = await func(context);
  } else {
    result.error = `Unknown Method: ${ServiceName[result.name]}`;
    result.status = Status.NotFound;
  }

  return result;
}