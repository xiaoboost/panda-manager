process.env.NODE_ENV = 'production';

import { build } from './utils';

build(process.argv[2]);
