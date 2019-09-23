process.env.NODE_ENV = 'production';

import Config from './webpack';
import { build } from './utils';

build(Config[process.argv[2]]);
