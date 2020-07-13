import { MangaData, Category, kind } from './constant';
import { buildPreview, writePriview } from './preview';

import * as path from 'path';
import * as fs from 'src/utils/node/file-system';

import { uid } from 'src/utils/shared/uid';

export async function from(file: string): Promise<MangaData | undefined> {
    // 读取压缩包信息
    const fileStat = await fs.stat(file);
    // 是否是文件夹
    const isDirectory = fileStat.isDirectory();
    // 编号
    const id = uid();

    // 剔除非 zip 文件
    if (!isDirectory && path.extname(file) !== '.zip') {
        return;
    }

    // 生成预览文件数据
    const preview = isDirectory
        ? await buildPreview(file)
        : await buildPreview(await fs.readFile(file));

    // 生成预览出错
    if (!preview) {
        return;
    }

    // 预览数据写入硬盘
    await writePriview(id, preview);

    // 生成数据
    return {
        id,
        kind,
        isDirectory,
        tags: [],
        extension: name,
        category: Category.NonH,
        filePath: file,
        fileSize: isDirectory ? await fs.fileSize(file) : fileStat.size,
        lastModified: new Date(fileStat.mtime).getTime(),
        previewPositions: preview.position,
    };
}
