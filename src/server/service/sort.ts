import { Config, SortOption } from '../model';

const { data } = Config;

export function patch(sort: Partial<SortOption>): void {
    data.sort = {
        ...data.sort,
        ...sort,
    };
}

export function get(): SortOption {
    return { ...data.sort };
}
