import Store from 'render/lib/store';

import { arrayMethods } from './utils';

const defaultVal: string[] = [];

export default new Store(defaultVal, arrayMethods);
