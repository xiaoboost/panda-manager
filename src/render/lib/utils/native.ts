export function omit<T>(from: T, keys: string[]) {
    const result = Object.assign({}, from);

    for (const key of keys) {
        delete result[key];
    }

    return result as T;
}

export function remove<T>(arr: T[], item: T) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            arr.splice(index, 1);
            return;
        }
    }
}
