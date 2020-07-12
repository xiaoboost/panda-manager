import * as Config from './config';
import * as Files from './files';

import {
    EventData,
    EventName,
} from 'src/utils/typings';

export async function route(param: EventData<any>): Promise<EventData<any>> {
    const { data, name } = param;

    let err = '';
    let result: any = void 0;

    switch (name) {
        case EventName.GetConfig: {
            result = await Config.get();
            break;
        }
        case EventName.UpdateConfig: {
            result = await Config.patchConfig(data);
            break;
        }
        case EventName.UpdateSortOption: {
            result = await Config.patchSort(data);
            break;
        }
        case EventName.GetFilesList: {
            result = await Files.search();
            break;
        }
        default: {
            err = 'Unkonw Method.';
        }
    }

    return {
        ...param,
        error: err,
        data: result,
    };
}
