import { resolveUserDir } from 'src/utils/node/env';

export function cover(id: number) {
    return resolveUserDir(id, 'cover.jpg');
}

export function preview(id: number) {
    return resolveUserDir(id, 'preview.jpg');
}

export const path = {
    cover,
    preview,
};
