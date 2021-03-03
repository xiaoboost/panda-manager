import * as Config from './config';
import * as Files from './files';

import { EventData, EventStatus } from '@panda/shared';

export async function route(request: EventData): Promise<EventData> {
  let result: EventData = {
    ...request,
    status: EventStatus.Ok,
  };

  try {
    switch (request.name) {
      case 'get-config': {
        result = await Config.get();
        break;
      }
      case 'update-config': {
        result = await Config.patchConfig(request);
        break;
      }
      case 'update-sort': {
        result = await Config.patchSort(request);
        break;
      }
      case 'get-files-list': {
        result = await Files.search(request);
        break;
      }
      case 'open-file': {
        result = await Files.open(request);
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
