import * as Files from '../service/files';

export async function search() {
    return (await Files.search()).map(({ data }) => ({ ...data }));
}

export async function remove() {
    // ..
}

export async function get() {
    // ..
}

export async function open(id: number) {
    await Files.open(id);
}
