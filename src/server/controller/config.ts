import * as Dir from '../service/directory';
import * as Sort from '../service/sort';

import { ConfigData, SortOption } from '../model/types';

export async function get(): Promise<ConfigData> {
    return {
        directories: await Dir.get(),
        sort: await Sort.get(),
    };
}

export async function patchConfig(data: Partial<ConfigData>) {
    // ..
}

export async function patchSort(data: Partial<SortOption>) {
    // ..
}
