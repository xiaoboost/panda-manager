import { join } from 'path';
import { app } from 'electron';

/** exe 调用路径 */
const initCWD = process.env.INIT_CWD;

/** 软件根目录 */
const appRoot = process.env.NODE_ENV === 'development' ? join(initCWD, 'dist') : initCWD;
/** 渲染进程根目录 */
const appRender = process.env.NODE_ENV === 'development' ? join(initCWD, 'dist/renderer') : initCWD;
/** 缓存文件夹路径 */
const userDir = app.getPath('userData');

/** 由软件根目录的相对路径转变为绝对路径 */
export function resolveRoot(...paths: (string | number)[]) {
    return join(appRoot, ...paths.map(String));
}

/** 由渲染资源目录的相对路径转变为绝对路径 */
export function resolveRender(...paths: (string | number)[]) {
    return join(appRender, ...paths.map(String));
}

/** 由缓存资源目录的相对路径转变为绝对路径 */
export function resolveUserDir(...paths: (string | number)[]) {
    return join(userDir, ...paths.map(String));
};
