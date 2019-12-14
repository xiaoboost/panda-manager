import * as path from 'path';
import * as fs from 'fs-extra';

import ListCover from './list-cover';
import DetailPage from './detail-page';

import * as Module from '../module';
import * as MangaUtils from './utils';

export async function from({ id, file, buffer }: Module.FromContext): Promise<MangaUtils.MangaData | undefined> {
    // 跳过非 zip 文件
    if (path.extname(file) !== '.zip') {
        return;
    }

    // 读取压缩包信息
    const fileStat = await fs.stat(file);
    // 生成预览文件数据
    const preview = await MangaUtils.buildPreview(await buffer());

    if (!preview) {
        return;
    }

    // 预览数据写入硬盘
    await MangaUtils.writePriview(id, preview);

    // 生成数据
    return {
        id,
        category: MangaUtils.Category.NonH,
        type: Module.ModuleType.Manga,
        tags: [],
        name: path.basename(file),
        filePath: file,
        fileSize: fileStat.size,
        isDirectory: fileStat.isDirectory(),
        lastModified: new Date(fileStat.mtime).getTime(),
        previewPositions: preview.position,
    };
}

/** 指定类型常量 */
export const type = Module.ModuleType.Manga;

export {
    ListCover,
    DetailPage,
};
