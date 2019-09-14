import infoOf from 'image-size';
import { default as Sharp, JpegOptions, PngOptions } from 'sharp';

interface ImageSize {
    width: number;
    height: number;
}

interface JpgImageCompressOption extends JpegOptions {
    type: 'jpg';
    size?: Partial<ImageSize>;
}

interface PngImageCompressOption extends PngOptions {
    type: 'png';
    size?: Partial<ImageSize>;
}

/** 压缩图片 */
export function compressImage(image: Buffer, options: JpgImageCompressOption): Promise<Buffer>;
export function compressImage(image: Buffer, options: PngImageCompressOption): Promise<Buffer>;
export function compressImage(image: Buffer, {
    type,
    size: toSize = {},
    ...options
}: JpgImageCompressOption | PngImageCompressOption) {
    return new Promise<Buffer>((resolve, reject) => {
        let sharp = Sharp(image);
        const originInfo = infoOf(image);

        // 要求变更输出尺寸，且输出尺寸和图片原尺寸不同
        if (
            (toSize.width && originInfo.width !== toSize.width) ||
            (toSize.height && originInfo.height !== toSize.height)
        ) {
            sharp = sharp.resize(toSize.width, toSize.height);
        }

        // 类型不同，需要转换格式
        if (originInfo.type !== type) {
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

/**
 * 图片向右拼接
 *  - extend 图片会放在 main 图片的右边
 */
export function concatImage(main: Buffer, extend: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
        const { width } = infoOf(extend);

        Sharp(main)
            .extend({
                top: 0, bottom: 0, left: 0, right: width,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .composite([{
                input: extend,
                gravity: Sharp.gravity.east,
            }])
            .toBuffer()
            .then(resolve)
            .catch(reject);
    });
}
