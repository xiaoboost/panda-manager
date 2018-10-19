import { join } from 'path';

export const appRoot = process.env.NODE_ENV === 'development'
    ? join(process.env.INIT_CWD as string, 'dist')
    : process.env.INIT_CWD as string;
