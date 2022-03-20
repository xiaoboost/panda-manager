function getFontFamily(names: string[]) {
  return names.join(', ');
}

/** 默认字体 */
export const FontDefault = '思源黑体';
/** 等宽字体 */
export const FontMono = getFontFamily(['Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace']);
/** 默认字体大小 */
export const FontDefaultSize = 12;
/** 全局类名 */
export enum GlobalClassName {
  flexCenter = '_flex-center',
  flexColCenter = '_flex-col-center',
  flexLineCenter = '_flex-line-center',
}
