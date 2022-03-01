import * as path from 'path';
import * as fs from '@panda/client-utils';

import { MangaData, MangaKind } from '../shared';
import { getCoverPath, getTempDirPath } from './path';
import { getCoverData } from './utils';

import type { DeepReadonly } from '@xiao-ai/utils';
import type { PluginClientInstance } from '@panda/shared';

export class Manga implements PluginClientInstance {
  /** 缓存 */
  private cache?: Buffer;
  /** 编号 */
  private _id: number;
  /** 数据 */
  private readonly _data: DeepReadonly<MangaData>;

  constructor(id: number, data: MangaData | DeepReadonly<MangaData>) {
    this._id = id;
    this._data = { ...data };
  }

  get id() {
    return this._id;
  }
  set id(id: number) {
    this._id = id;
  }

  get data() {
    return this._data;
  }

  async writeCache() {
    let cache = this.cache;
    const coverPath = getCoverPath(this.id);

    if (!cache) {
      cache = await getCoverData(this.data.uri, this.data.mangaKind === MangaKind.Directory);
    }

    await fs.mkdirp(path.dirname(coverPath));
    await fs.writeFile(coverPath, cache);
  }

  async removeCache() {
    return fs.remove(getTempDirPath(this.id));
  }

  openInShell() {
    // const filePath = data.filePath;
    // const outputPath = temp(data.id);
    // // 文件夹则直接打开文件夹
    // if (data.isDirectory) {
    //   shell.openPath(filePath);
    // }
    // // 非文件夹，但是已经被解压
    // else if (fs.existsSync(outputPath)) {
    //   shell.openPath(outputPath);
    // }
    // else {
    //   await unpackZip(data.filePath, outputPath, cb);
    //   shell.openPath(outputPath);
    // }
  }

  toRendererData() {
    // ..
  }
}
