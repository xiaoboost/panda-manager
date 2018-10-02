import { resolve, join } from 'path';

// export const appRoot = resolve(
//     __dirname,
//     process.env.NODE_ENV === 'development'
//         ? '../../../../../../dist'
//         : '../../../',
// );

export const appRoot = process.env.NODE_ENV === 'development'
    ? join(process.env.INIT_CWD as string, 'dist')
    : process.env.INIT_CWD as string;
