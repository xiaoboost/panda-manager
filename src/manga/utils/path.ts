const { userPath } = panda.resolve;

export function coverPath(id: number) {
    return userPath(id, 'cover.jpg');
}

export function previewPath(id: number) {
    return userPath(id, 'preview.jpg');
}
