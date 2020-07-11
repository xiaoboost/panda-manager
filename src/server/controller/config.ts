import * as Dir from '../service/directory';
import * as Sort from '../service/sort';

import { ConfigData, SortOption } from 'src/utils/typings';

export async function get(): Promise<ConfigData> {
    return {
        directories: await Dir.get(),
        sort: await Sort.get(),
    };
}

export async function patchConfig(data: Partial<ConfigData>) {
    if (data.directories) {
        await Dir.update(data.directories);
    }

    if (data.sort) {
        await patchSort(data.sort);
    }
}

export async function patchSort(data: Partial<SortOption>) {
    await Sort.patch(data);
}
