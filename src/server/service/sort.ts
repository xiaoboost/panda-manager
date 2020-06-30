import { Config } from '../model';
import { SortOption } from '../model/types';

const { data, ready } = Config;

export async function patch(sort: Partial<SortOption>): Promise<void> {
    await ready;

    data.sort = {
        ...data.sort,
        ...sort,
    };
}

export async function get(): Promise<SortOption> {
    await ready;
    return { ...data.sort };
}
