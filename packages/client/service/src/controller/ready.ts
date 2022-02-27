import { ServiceData } from './types';

import { ready as directory } from '../service/directory';
import { ready as sort } from '../service/sort';
import { ready as tag } from '../service/tag';

export const service: ServiceData<Promise<void>> = () => {
  return Promise.all([
    directory,
    sort,
    tag,
  ]).then(() => void 0);
};
