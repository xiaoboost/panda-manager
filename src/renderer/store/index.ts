import { configReady } from './config';
import { databaseReady } from './database';
import { directoryReady } from './directory';

export const ready = Promise.all([
    configReady,
    databaseReady,
    directoryReady,
]);

export * from './state';
export * from './config';
export * from './database';
export * from './directory';
