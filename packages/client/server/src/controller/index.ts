import { RPC } from '@panda/shared';

import { service as ready } from './ready';
import { service as getConfig } from './get-config';
import { service as patchConfig } from './patch-config';

const services = [
  ready,
  getConfig,
  patchConfig,
];

export async function route(request: RPC.Data): Promise<RPC.Data> {
  const result: RPC.Data = {
    ...request,
    status: RPC.Status.Ok,
  };

  try {
    const service = services.find((item) => item.name === request.name);

    if (service) {
      result.data = await service.service(request);
    }
    else {
      result.error = `Unknown Method: ${request.name}`;
      result.status = RPC.Status.NotFound;
    }
  }
  catch (e: any) {
    result.error = e.message;
    result.status = RPC.Status.ServerError;
  }

  return result;
}
