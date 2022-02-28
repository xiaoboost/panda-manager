import { imageSize as toSize } from 'image-size';

/** 是否是图片 */
export function isImage(image: Buffer) {
  try {
    const { type } = toSize(image);
    return Boolean(type);
  } catch (e) {
    return false;
  }
}

/** 图像大小 */
export function imageSize(image: Buffer) {
  try {
    const { type, width, height } = toSize(image);

    if (!type) {
      return null;
    }

    return {
      width: width ?? 0,
      height: height ?? 0,
    };
  } catch (e) {
    return null;
  }
}
