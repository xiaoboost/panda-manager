function getFontFamily(names: string[]) {
  return names.join(', ');
}

/** 默认字体 */
export const FontDefault = /* @__PURE__ */ getFontFamily([
  '-apple-system',
  'BlinkMacSystemFont',
  'PingFang SC',
  '思源黑体',
  'Source Han Sans SC',
  'Noto Sans CJK SC',
  'WenQuanYi Micro Hei',
  'Microsoft YaHei',
  'sans-serif',
]);

/** 衬线字体 */
export const FontSerif = /* @__PURE__ */ getFontFamily(['Georgia', 'STSong', '宋体', 'serif']);

/** 等宽字体 */
export const FontMono = /* @__PURE__ */ getFontFamily([
  'Menlo',
  'Monaco',
  'Consolas',
  'Courier New',
  'monospace',
]);

/** 默认字体大小 */
export const FontDefaultSize = 16;
/** 标题元素选择器 */
export const getHeadSelector = (pre = '') => {
  return Array(5)
    .fill(0)
    .map((_, i) => `${pre}h${i + 1}`)
    .join(',');
};
