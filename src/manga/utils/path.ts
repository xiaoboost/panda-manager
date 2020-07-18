import { resolveUserDir, resolveTempDir } from 'src/utils/node/env';

const mangaDir = 'manga';

export function cover(id: number) {
    return resolveUserDir(mangaDir, id, 'cover.jpg');
}

export function preview(id: number) {
    return resolveUserDir(mangaDir, id, 'preview.jpg');
}

export function temp(id: number) {
    return resolveTempDir(mangaDir, id);
}

export const path = {
    cover,
    preview,
};
