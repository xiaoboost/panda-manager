import { join } from 'path';
import { existsSync, mkdirpSync } from 'fs-extra';
import { app as originApp, remote } from 'electron';

/** 软件名称 */
export const appName = 'panda-manager';

/** exe 调用路径 */
const initCWD = process.env.INIT_CWD;
/** 主进程模块 */
const app = originApp ? originApp : remote.app;

/** 软件根目录 */
const appRoot = process.env.NODE_ENV === 'development' ? join(initCWD, 'dist') : initCWD;
/** 渲染进程根目录 */
const appRender = process.env.NODE_ENV === 'development' ? join(initCWD, 'dist/renderer') : initCWD;
/** 缓存文件夹路径 */
const userDir = app.getPath('userData');
/** 软件临时件夹路径 */
const tempDir = join(app.getPath('temp'), appName);

// 如果没有临时文件夹，则创建
if (!existsSync(tempDir)) {
    mkdirpSync(tempDir);
}

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
}

/** 由临时资源目录的相对路径转变为绝对路径 */
export function resolveTempDir(...paths: (string | number)[]) {
    return join(tempDir, appName, ...paths.map(String));
}
