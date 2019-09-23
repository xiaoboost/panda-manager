process.env.NODE_ENV = 'development';

import Config from './webpack';
import { devBuild } from './utils';

const project = process.argv[2];
const projectName = project[0].toUpperCase() + project.slice(1);

devBuild(Config[project], `${projectName} script done.`);
