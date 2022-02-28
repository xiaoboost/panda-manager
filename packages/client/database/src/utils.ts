import * as zlib from 'zlib';
import * as fs from 'fs';

import { promisify } from 'util';

export const gzip = promisify<zlib.InputType, Buffer>(zlib.gzip);
export const gunzip = promisify<zlib.InputType, Buffer>(zlib.gunzip);

export const readFile = promisify<string, Buffer>(fs.readFile);
export const writeFile = promisify<string, string | Buffer>(fs.writeFile);
