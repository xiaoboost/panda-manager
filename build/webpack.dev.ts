process.env.NODE_ENV = 'development';

import { devBuild } from './utils';

devBuild(process.argv[2]);
