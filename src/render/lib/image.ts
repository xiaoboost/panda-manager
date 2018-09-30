import sizeOf from 'image-size';
import Sharp, { JpegOptions, PngOptions } from 'sharp';

type CompressOption = (JpegOptions | PngOptions) & {
    size?: {
        width?: number;
        height?: number;
    };
}

/** 压缩图片 */
export function compress(
    image: Buffer,
    type: 'jpg' | 'png',
    { size, ...options }: CompressOption = {},
) {
    return new Promise<Buffer>((resolve, reject) => {
        let sharp = Sharp(image);
        const info = sizeOf(image);

        // 要求变更输出尺寸，且输出尺寸和图片原尺寸不同
        if (
            size &&
            (
                (size.width && info.width !== size.width) ||
                (size.height && info.height !== size.height)
            )
        ) {
            sharp = sharp.resize(size.width, size.height);
        }

        // 类型不同，需要转换格式
        if (info.type !== type) {
            if (type === 'jpg') {
                sharp = sharp.jpeg(options);
            }
            else {
                sharp = sharp.png(options);
            }
        }

        sharp
            .toBuffer()
            .then(resolve)
            .catch(reject);
    });
}

/** 生成漫画预览 */
export function imageExtend(main: Buffer, extend: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
        const { width } = sizeOf(extend);

        Sharp(main)
            .background({ r: 0, g: 0, b: 0, alpha: 0 })
            .extend({ right: width })
            .overlayWith(extend, {
                gravity: Sharp.gravity.east,
            })
            .toBuffer()
            .then(resolve)
            .catch(reject);
    });
}
