import { service as ready } from './ready';
import { service as getConfig } from './get-config';
import { service as patchConfig } from './patch-config';

import { ServiceData } from './types';
import { ServiceName } from '@panda/shared';
import { Status, FetchData, ListenerContext } from '@panda/fetch/client';

const serviceMap: Record<ServiceName, ServiceData | undefined> = {
  [ServiceName.Ready]: ready,
  [ServiceName.GetConfig]: getConfig,
  [ServiceName.PatchConfig]: patchConfig,
  [ServiceName.GetFilesList]: undefined,
  [ServiceName.GetFileDetail]: undefined,
  [ServiceName.OpenFileInShell]: undefined,
};

export async function service(context: ListenerContext): Promise<FetchData> {
  const result = { ...context.requestData };
  const service = serviceMap[result.name];

  if (service) {
    result.data = await service.service(context);
  }
  else {
    result.error = `Unknown Method: ${ServiceName[result.name]}`;
    result.status = Status.NotFound;
  }

  return result;
}
