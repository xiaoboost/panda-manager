import { join } from 'path';

export const appRoot = process.env.NODE_ENV === 'development'
    ? join(process.env.INIT_CWD as string, 'dist')
    : process.env.INIT_CWD as string;

/** FIXME: 运行时候的真路径还需要确认 */
export const appRenderRoot = process.env.NODE_ENV === 'development'
    ? join(process.env.INIT_CWD as string, 'dist/render')
    : process.env.INIT_CWD as string;

export function resolveRender(path: string) {
    return join(appRenderRoot, path);
}
