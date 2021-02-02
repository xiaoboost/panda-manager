import { join } from 'path';
import { app as originApp, remote } from 'electron';

/** 软件名称 */
export const appName = 'panda-manager';

/** 主进程模块 */
const app = originApp ? originApp : remote.app;
/** exe 调用路径 */
const initCWD = app.getAppPath();

/** 软件根目录 */
const appRoot = process.env.NODE_ENV === 'development' ? initCWD : initCWD;
/** 软件临时件夹路径 */
const tempDir = join(app.getPath('temp'), appName);
/** 缓存文件夹路径 */
const userDir = process.env.NODE_ENV === 'development'
    ? join(app.getPath('temp'), `${appName}-dev-userdir`)
    : app.getPath('userData');

/** 由软件根目录的相对路径转变为绝对路径 */
export function resolveRoot(...paths: (string | number)[]) {
    return join(appRoot, ...paths.map(String));
}

/** 由缓存资源目录的相对路径转变为绝对路径 */
export function resolveUserDir(...paths: (string | number)[]) {
    return join(userDir, ...paths.map(String));
}

/** 由临时资源目录的相对路径转变为绝对路径 */
export function resolveTempDir(...paths: (string | number)[]) {
    return join(tempDir, ...paths.map(String));
}
