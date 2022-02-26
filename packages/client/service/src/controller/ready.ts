import { ServiceData } from './types';

import { ready as directory } from '../service/directory';
import { ready as files } from '../service/files';
import { ready as sort } from '../service/sort';
import { ready as tag } from '../service/tag';

export const service: ServiceData<Promise<void>> = () => {
  return Promise.all([
    directory,
    files,
    sort,
    tag,
  ]).then(() => void 0);
};
