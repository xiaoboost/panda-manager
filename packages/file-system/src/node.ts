import { promises as fs, existsSync } from 'fs';

export const readFile = fs.readFile;
export const writeFile = fs.writeFile;
export const stat = fs.stat;
export const readdir = fs.readdir;
export const rm = fs.unlink;
export const exists = existsSync;
export const mkdir = fs.mkdir;

export { createReadStream, createWriteStream, Stats } from 'fs';
