import { Files, Config } from '../model';
import { BaseFileData, FileKind, SortBy } from 'src/utils/typings';
import { transArr, toBoolMap } from 'src/utils/shared/array';

import { Data as MangaData, open as openManga } from 'src/manga/main';

export function remove(input: string | string[]) {
    const exMap = toBoolMap(transArr(input));
    Files.where(({ filePath }) => exMap[filePath]).remove();
}

export function update(data: Partial<BaseFileData>) {
    // ..
}

export async function get(id: number) {
    await Files.ready;
    const file = Files.limit(1).where((item) => item.id === id).toQuery()[0];

    if (!file) {
        throw new Error(`Can not find file from id: ${id}`);
    }

    return file.data;
}

export async function search() {
    await Files.ready;

    const { sort } = Config.data;
    const sortBy = {
        [SortBy.name]: 'name',
        [SortBy.size]: 'fileSize',
        [SortBy.lastModified]: 'lastModified',
    } as const;

    return Files
        .orderBy(sortBy[sort.by], sort.asc ? 'asc' : 'desc')
        .toQuery();
}

export async function open(id: number, toProgress: Func<number>) {
    const file = Files.limit(1).where((item) => item.id === id).toQuery()[0];

    if (!file) {
        throw new Error(`Can not find file from id: ${id}`);
    }

    if (file.data.kind === FileKind.Mange) {
        await openManga(file.data as MangaData, toProgress);
    }
    else {
        throw new Error(`Unknow file kind: ${FileKind[file.data.kind]}`);
    }
}
