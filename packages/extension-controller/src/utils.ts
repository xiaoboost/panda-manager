import { resolveUserDir, resolveTempDir } from '@utils/node/env';

/** 项目元数据文件夹 */
export function userDir(name: string) {
    return resolveUserDir(`extension-${name}`);
}

/** 项目临时文件夹 */
export function tempDir(name: string) {
    return resolveTempDir(`extension-${name}`);
}
