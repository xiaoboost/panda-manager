import { resolveUserDir } from 'src/utils/node/env';

const mangaDir = 'manga';

export function cover(id: number) {
    return resolveUserDir(mangaDir, id, 'cover.jpg');
}

export function preview(id: number) {
    return resolveUserDir(mangaDir, id, 'preview.jpg');
}

export const path = {
    cover,
    preview,
};
