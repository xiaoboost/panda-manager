import { resolve } from 'path';

export const appRoot = resolve(
    __dirname,
    process.env.NODE_ENV === 'development'
        ? '../../../../../../dist'
        : '../../../',
);
