import { Files } from '../model';
import { BaseFileData } from 'src/utils/typings';
import { transArr, toBoolMap } from 'src/utils/shared/array';

export function remove(input: string | string[]) {
    const exMap = toBoolMap(transArr(input));
    Files.where(({ filePath }) => exMap[filePath]).remove();
}

export function update(data: Partial<BaseFileData>) {
    // ..
}

export async function get(id: number) {
    await Files.ready;
}

export async function search() {
    await Files.ready;
    return Files.toQuery();
}
