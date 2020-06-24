import * as zlib from 'zlib';

import { promisify } from 'util';

export const gzip = promisify<zlib.InputType, Buffer>(zlib.gzip);
export const gunzip = promisify<zlib.InputType, Buffer>(zlib.gunzip);
