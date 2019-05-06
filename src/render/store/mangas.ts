import Store from 'render/lib/store';

import { Manga } from '../lib/manga';
import { objectMethods } from './utils';

const defaultVal: AnyObject<Manga> = {};

export default new Store(defaultVal, objectMethods);
