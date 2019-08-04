process.env.NODE_ENV = 'production';

import { build } from '../utils';
import BaseConfig from './webpack.base';

build(BaseConfig);
