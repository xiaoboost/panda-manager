import { resolveUserDir } from 'src/utils/node/env';

export function coverPath(id: number) {
    return resolveUserDir(id, 'cover.jpg');
}

export function previewPath(id: number) {
    return resolveUserDir(id, 'preview.jpg');
}
