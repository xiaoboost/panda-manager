import { Files } from '../model/database';
import { delay } from 'src/utils/shared/func';
import { BrowserWindow } from 'electron';
import { EventName } from 'src/utils/typings';

import * as Manga from '../../manga/main';

let win: BrowserWindow;

/** 文件处理队列 */
class FilesQueue extends Array<string> {
    /** 当前是否正在处理文件 */
    private _loading = false;

    /** 添加文件 */
    push(...paths: string[]) {
        if (paths.length === 0) {
            return this.length;
        }

        if (!this._loading) {
            this._loading = true;
            this.start();
        }

        return super.push(...paths);
    }

    async start() {
        await delay();

        while (this.length > 0) {
            const file = this.shift()!;
            const result = await Manga.from(file);

            if (!result) {
                continue;
            }

            Files.insert(result);

            if (win) {
                win.webContents.send(EventName.UpdateFilesList);
            }
        }

        this._loading = false;
    }
}

export function installFilesQueue(window: BrowserWindow) {
    win = window;
}

export const filesQueue = new FilesQueue();
