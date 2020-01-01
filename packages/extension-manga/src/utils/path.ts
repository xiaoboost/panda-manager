import { join } from 'path';
import { metaDir } from '@panda/extension-controller';

export function coverPath(id: number) {
    return join(metaDir(id), 'cover.jpg');
}

export function previewPath(id: number) {
    return join(metaDir(id), 'preview.jpg');
}
