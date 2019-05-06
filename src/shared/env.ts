import { join } from 'path';

/** exe 调用路径 */
const initCWD = process.env.INIT_CWD as string;

/** 软件根目录 */
const appRoot = process.env.NODE_ENV === 'development' ? join(initCWD, 'dist') : initCWD;
/** 渲染进程根目录 */
const appRender = process.env.NODE_ENV === 'development' ? join(initCWD, 'dist/render') : initCWD;
/** 缓存文件夹路径 */
const cacheDir = resolveRoot('cache');

/** 由软件根目录的相对路径转变为绝对路径 */
export function resolveRoot(...paths: (string | number)[]) {
    return join(appRoot, ...paths.map(String));
}

/** 由渲染资源目录的相对路径转变为绝对路径 */
export function resolveRender(...paths: (string | number)[]) {
    return join(appRender, ...paths.map(String));
}

/** 由缓存资源目录的相对路径转变为绝对路径 */
export const resolveCache = (...paths: (string | number)[]) => {
    return join(cacheDir, ...paths.map(String));
};
