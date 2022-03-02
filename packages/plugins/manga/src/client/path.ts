import { resolveUserDir, resolveTempDir } from '@panda/client-utils';

const mangaDir = 'manga';

export function getCoverPath(id: number) {
  return resolveUserDir(mangaDir, id, 'cover.jpg');
}

export function getTempDirPath(id: number) {
  return resolveTempDir(mangaDir, id);
}
