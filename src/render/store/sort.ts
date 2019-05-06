import Store from 'render/lib/store';

import { objectMethods } from './utils';
import { SortOption, SortBy } from '../lib/cache';

const defaultVal: SortOption = {
    by: SortBy.name,
    asc: true,
};

export default new Store(defaultVal, objectMethods);
