import * as Config from './config';
import * as Files from './files';

import {
    EventData,
    EventName,
    EventContext,
} from 'src/utils/typings';

export async function route(request: EventData<any>, context: EventContext): Promise<EventData<any>> {
    let result: any = void 0;

    switch (request.name) {
        case EventName.GetConfig: {
            result = await Config.get();
            break;
        }
        case EventName.UpdateConfig: {
            result = await Config.patchConfig(request);
            break;
        }
        case EventName.UpdateSortOption: {
            result = await Config.patchSort(request);
            break;
        }
        case EventName.GetFilesList: {
            result = await Files.search(request);
            break;
        }
        case EventName.OpenFile: {
            result = await Files.open(request, context);
            break;
        }
        default: {
            throw new Error(`Unkonw Method: ${name}`);
        }
    }

    return result;
}
