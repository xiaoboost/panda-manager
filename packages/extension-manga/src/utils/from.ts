import { MangaData } from './constant';
import { buildPreview, writePriview } from './preview';

const { fs, path } = panda;

export async function from(context: panda.FromContext): Promise<MangaData | undefined> {
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
        ? await buildPreview(context.path)
        : await buildPreview(await context.buffer());

    // 生成预览出错
    if (!preview) {
        return;
    }

    // 预览数据写入硬盘
    await writePriview(context.id, preview);

    // 生成数据
    return {} as any;
    // return {
    //     id: context.id,
    //     category: utils.Category.NonH,
    //     name: path.basename(context.path),
    //     filePath: context.path,
    //     fileSize: isDirectory
    //         ? await fileSize(context.path)
    //         : fileStat.size,
    //     tags: [],
    //     isDirectory,
    //     lastModified: new Date(fileStat.mtime).getTime(),
    //     previewPositions: preview.position,
    // };
}
