process.env.NODE_ENV = 'development';

import { devBuild } from '../utils';
import BaseConfig from './webpack.base';

devBuild(BaseConfig, 'Render script compiled.');
