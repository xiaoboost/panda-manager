import { imageSize } from 'image-size';
import { default as Sharp, JpegOptions, PngOptions } from 'sharp';

interface ImageSize {
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
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
export function compress(image: Buffer, options: JpgImageCompressOption): Promise<Buffer>;
export function compress(image: Buffer, options: PngImageCompressOption): Promise<Buffer>;
export function compress(image: Buffer, {
    type,
    size: toSize = {},
    ...options
}: JpgImageCompressOption | PngImageCompressOption) {
    /** 是否经历转换 */
    let hasTrans = false;
    /** 图片转换器 */
    let sharp = Sharp(image);
    /** 原始图片属性 */
    const { width, height, type: imageType } = imageSize(image);
    /** 宽高比 */
    const radio = height! / width!;
    /** 取整运算 */
    const { floor } = Math;

    // 输出尺寸和图片原尺寸不同
    if ((toSize.width && width !== toSize.width) || (toSize.height && height !== toSize.height)) {
        hasTrans = true;
        // 宽高都存在，则设置为包含，多余部分填充白色
        if (toSize.width && toSize.height) {
            sharp = sharp.resize(toSize.width, toSize.height, {
                fit: 'contain',
                background: '#ffffff',
            });
        }
        // 单独设置宽度
        else if (toSize.width) {
            // 缩放之后的宽高
            let width = toSize.width;
            let height = radio * toSize.width;

            // 限高
            if (toSize.maxHeight && height > toSize.maxHeight) {
                height = toSize.maxHeight;
                width = height / radio;
            }

            sharp = sharp.resize(floor(width), floor(height));
        }
        // 单独设置高度
        else if (toSize.height) {
            // 缩放之后的宽高
            let height = toSize.height;
            let width = toSize.height / radio;

            // 限高
            if (toSize.maxWidth && width > toSize.maxWidth) {
                width = toSize.maxWidth;
                height = radio * width;
            }

            sharp = sharp.resize(floor(width), floor(height));
        }
    }

    // 类型不同，需要转换格式
    if (imageType !== type) {
        hasTrans = true;

        if (type === 'jpg') {
            sharp = sharp.jpeg(options);
        }
        else {
            sharp = sharp.png(options);
        }
    }

    return hasTrans
        ? sharp.toBuffer()
        : Promise.resolve(image);
}

/**
 * 图片向右拼接
 *  - extend 图片会放在 main 图片的右边
 */
export function concat(main: Buffer, extend: Buffer) {
    const { width } = imageSize(extend);

    return Sharp(main)
        .extend({
            top: 0, bottom: 0, left: 0, right: width,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .composite([{
            input: extend,
            gravity: Sharp.gravity.east,
        }])
        .toBuffer();
}
