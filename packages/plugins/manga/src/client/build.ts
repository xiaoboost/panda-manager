import { shell } from 'electron';

import { ItemKind } from '@panda/shared';
import { MangaData, MangaKind } from '../shared';
import { getCover } from './utils';
import { getTempDirPath } from './path';

import * as path from 'path';
import * as fs from '@panda/client-utils';

/** 生成项目数据 */
export async function build(file: string, fileStat: fs.Stats): Promise<MangaData | undefined> {
  // 是否是文件夹
  const isDirectory = fileStat.isDirectory();
  // 文件名称
  const name = path.parse(file).name;

  // 剔除非 zip 文件
  if (!isDirectory && path.extname(file) !== '.zip') {
    return;
  }

  // 生成封面预览
  const coverImage = await getCover(file, fileStat);

  // 生成预览出错
  if (!coverImage) {
    return;
  }

  // 预览数据写入硬盘
  // await writePreview(id, preview);

  return {
    id: -1,
    kind: ItemKind.Manga,
    mangaKind: isDirectory ? MangaKind.Directory : MangaKind.Zip,
    name,
    tags: [],
    uri: file,
    fileSize: isDirectory ? await fs.readFileSize(file) : fileStat.size,
    lastModified: fileStat.mtimeMs,
  };
}

/**  */
