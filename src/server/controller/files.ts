import * as Files from '../service/files';

export async function search() {
    return (await Files.search()).map(({ data }) => ({ ...data }));
}

export async function remove() {
    // ..
}

export async function get(is: number) {
    // ..
}
