import { BrowserWindow } from 'electron';

import { Files } from '../model';
import { toProgressEventName } from '../utils/constant';
import { BaseFileData, FileKind } from 'src/utils/typings';
import { transArr, toBoolMap } from 'src/utils/shared/array';

import { Data as MangaData, open as openManga } from 'src/manga/main';

let win: BrowserWindow;

export function installFiles(window: BrowserWindow) {
    win = window;
}

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

export async function open(id: number) {
    const file = Files.where((item) => item.id === id).toQuery()[0];

    if (!file) {
        throw new Error(`Can not find file from id: ${id}`);
    }

    if (file.data.kind === FileKind.Mange) {
        await openManga(file.data as MangaData, (progress) => {
            if (win) {
                win.webContents.send(toProgressEventName, progress);
            }
        });
    }
    else {
        throw new Error(`Unknow file kind: ${FileKind[file.data.kind]}`);
    }
}
