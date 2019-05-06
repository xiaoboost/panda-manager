import Store from 'render/lib/store';

import { TagGroup } from '../lib/tag';
import { objectMethods } from './utils';

const defaultVal: AnyObject<TagGroup> = {};

export default new Store(defaultVal, objectMethods);
