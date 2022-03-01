import * as path from 'path';
import * as fs from '@panda/client-utils';

import { ItemKind, PluginClientConstructor } from '@panda/shared';
import { MangaData, MangaKind } from '../shared';
import { Manga as Manga2 } from './manga';

export * from '../shared';

export const Manga: PluginClientConstructor<MangaData> = {
  createByData(id, data) {
    return new Manga2(id, data);
  },
  createByPath: async (filePath, stats) => {
    const fileStat = stats ?? (await fs.stat(filePath));
    const isDirectory = fileStat.isDirectory();
    const fileName = path.parse(filePath).name;

    // 剔除非 zip 文件
    if (!isDirectory && path.extname(filePath) !== '.zip') {
      return undefined;
    }

    return new Manga2(-1, {
      kind: ItemKind.Manga,
      mangaKind: isDirectory ? MangaKind.Directory : MangaKind.Zip,
      tags: [],
      name: fileName,
      uri: filePath,
      fileSize: isDirectory ? await fs.readFileSize(filePath) : fileStat.size,
      lastModified: fileStat.mtimeMs,
    });
  },
};
