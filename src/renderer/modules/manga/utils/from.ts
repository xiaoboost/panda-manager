import * as path from 'path';
import * as fs from 'fs-extra';

import * as utils from './';
import * as Module from '../../module';

import { fileSize } from 'utils/node';

export async function from(context: Module.FromContext): Promise<utils.MangaData | undefined> {
    // 读取压缩包信息
    const fileStat = await fs.stat(context.path);
    // 是否是文件夹
    const isDirectory = fileStat.isDirectory();

    // 剔除非 zip 文件
    if (!isDirectory && path.extname(context.path) !== '.zip') {
        return;
    }

    // 生成预览文件数据
    const preview = isDirectory
        ? await utils.buildPreview(context.path)
        : await utils.buildPreview(await context.buffer());

    // 生成预览出错
    if (!preview) {
        return;
    }

    // 预览数据写入硬盘
    await utils.writePriview(context.id, preview);

    // 生成数据
    return {
        id: context.id,
        category: utils.Category.NonH,
        type: Module.ModuleType.Manga,
        name: path.basename(context.path),
        filePath: context.path,
        fileSize: isDirectory
            ? await fileSize(context.path)
            : fileStat.size,
        tags: [],
        isDirectory,
        lastModified: new Date(fileStat.mtime).getTime(),
        previewPositions: preview.position,
    };
}
