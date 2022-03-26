import * as path from 'path';
import * as fs from '@panda/client-utils';

import { MangaData, MangaKind, MangaDataInList, MangaDetail } from '../shared';
import { getCoverPath, getTempDirPath } from './path';
import { getCoverData } from './utils';

import type { PluginClientInstance } from '@panda/shared';

export class Manga implements PluginClientInstance<MangaData> {
  /** 缓存 */
  private cache?: Buffer;
  /** 编号 */
  private _id: number;
  /** 数据 */
  private readonly _data: Readonly<MangaData>;

  constructor(id: number, data: MangaData | Readonly<MangaData>) {
    this._id = id;
    this._data = data;
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

  async createCache() {
    if (!this.cache) {
      this.cache = await getCoverData(this.data.uri, this.data.mangaKind === MangaKind.Directory);
    }
  }

  async writeCache() {
    const coverPath = getCoverPath(this.id);

    await this.createCache();
    await fs.remove(coverPath);
    await fs.mkdirp(path.dirname(coverPath));
    await fs.writeFile(coverPath, this.cache);
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

  toRendererDataInList(): MangaDataInList {
    return {
      id: this.id,
      name: this.data.name,
      size: this.data.fileSize,
      kind: this.data.kind,
      coverPath: getCoverPath(this.id),
    };
  }

  toRendererDataInDetail(): MangaDetail {
    const { uri, ...rest } = this._data;

    return {
      ...rest,
      id: this._id,
      coverPath: getCoverPath(this.id),
    };
  }
}
