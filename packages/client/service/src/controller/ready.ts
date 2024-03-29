import { AsyncService } from './types';

import { ready as directory } from '../service/directories';
import { ready as sort } from '../service/sort';
import { ready as tag } from '../service/tags';

export const service: AsyncService<void, void> = () => {
  return Promise.all([directory, sort, tag]).then(() => void 0);
};
