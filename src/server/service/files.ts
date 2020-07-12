import { Files } from '../model';
import { BaseFileData } from 'src/utils/typings';

export async function add(data: BaseFileData) {
    // ..
}

export async function remove() {
    await Files.ready;
}

export async function update(data: Partial<BaseFileData>) {
    // ..
}

export async function get(is: number) {
    await Files.ready;
}

export async function search() {
    await Files.ready;
    return Files.toQuery();
}
