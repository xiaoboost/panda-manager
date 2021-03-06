import * as Config from './config';
import * as Files from './files';

import { EventData, EventStatus } from '@panda/shared';

export async function route(request: EventData): Promise<EventData> {
  const result: EventData = {
    ...request,
    status: EventStatus.Ok,
  };

  try {
    switch (request.name) {
      case 'ready': {
        result.data = await Config.get();
        break;
      }
      case 'get-config': {
        result.data = await Config.get();
        break;
      }
      case 'update-config': {
        result.data = await Config.patchConfig(request);
        break;
      }
      case 'update-sort': {
        result.data = await Config.patchSort(request);
        break;
      }
      case 'get-files-list': {
        result.data = await Files.get(request);
        break;
      }
      case 'open-file': {
        result.data = await Files.open(request);
        break;
      }
      default: {
        result.error = `Unknown Method: ${request.name}`;
        result.status = EventStatus.NotFound;
      }
    }
  }
  catch (e) {
    result.error = e.message;
    result.status = EventStatus.ServerError;
  }

  return result;
}
