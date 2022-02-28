import * as path from 'path';
import * as fs from '@panda/client-utils';

import { PluginClient, ItemKind } from '@panda/shared';
import { getCover } from './utils';
import { getCoverPath, getTempDirPath } from './path';
import { MangaData, MangaKind, MangaCache } from '../shared';

export * from '../shared';

export const Manga: PluginClient<MangaData, MangaCache> = {
  getDataByPath: async (filePath, stats) => {
    const fileStat = stats ?? (await fs.stat(filePath));
    const isDirectory = fileStat.isDirectory();
    const fileName = path.parse(filePath).name;

    // 剔除非 zip 文件
    if (!isDirectory && path.extname(filePath) !== '.zip') {
      return;
    }

    // 封面数据
    const cover = await getCover(filePath, fileStat);

    if (!cover) {
      return;
    }

    const data: MangaData = {
      id: -1,
      kind: ItemKind.Manga,
      mangaKind: isDirectory ? MangaKind.Directory : MangaKind.Zip,
      tags: [],
      name: fileName,
      uri: filePath,
      fileSize: isDirectory ? await fs.readFileSize(filePath) : fileStat.size,
      lastModified: fileStat.mtimeMs,
    };
    const cache: MangaCache = {
      cover,
    };

    return [data, cache];
  },
  writeCacheToDisk: async (data, cache) => {
    const cover = cache?.cover;

    if (cover) {
      const coverPath = getCoverPath(data.id);
      await fs.mkdirp(path.dirname(coverPath));
      await fs.writeFile(coverPath, cover);
    }
  },
  removeCacheFromDisk: (data) => {
    return fs.remove(getTempDirPath(data.id));
  },
  openItem: async (data) => {
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
  },
};
