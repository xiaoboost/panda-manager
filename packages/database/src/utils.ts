import * as zlib from 'zlib';

import { promises as fs } from 'fs';
import { promisify } from 'util';

export const gzip = promisify<zlib.InputType, Buffer>(zlib.gzip);
export const gunzip = promisify<zlib.InputType, Buffer>(zlib.gunzip);

export const readFile = fs.readFile;
export const writeFile = fs.writeFile;
