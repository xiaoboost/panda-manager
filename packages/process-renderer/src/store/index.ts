import * as Config from './config';
import * as Database from './database';
import * as Directory from './directory';

export const ready = Promise.all([
    Config.ready,
    Database.ready,
    Directory.ready,
]);

export {
    Config,
    Database,
    Directory,
};
