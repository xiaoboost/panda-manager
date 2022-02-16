function getFontFamily(names: string[]) {
  return names.join(', ');
}

/** 自定义字体名称枚举 */
export const CustomFont = {
  /** 英文正文 */
  Lato: `"Lato"`,
  /** 网站大标题 */
  Dancing: `"Dancing Script"`,
  /** 斜体英文 */
  EMLora: `"EM-Lora"`,
};

/** 默认字体 */
export const FontDefault = /* @__PURE__ */ getFontFamily([
  CustomFont.Lato,
  '-apple-system',
  'BlinkMacSystemFont',
  'PingFang SC',
  '思源黑体',
  'Source Han Sans SC',
  'Noto Sans CJK SC',
  'WenQuanYi Micro Hei',
  'Microsoft YaHei',
  'sans-serif'
]);

/** 衬线字体 */
export const FontSerif = /* @__PURE__ */ getFontFamily([
  '思源宋体',
  'STSong',
  '宋体',
  'serif',
]);

/** 等宽字体 */
export const FontMono = /* @__PURE__ */ getFontFamily([
  'Menlo',
  'Monaco',
  'Consolas',
  'Courier New',
  'monospace',
]);

/** 标题字体 */
export const FontTitle = /* @__PURE__ */ getFontFamily([
  CustomFont.Dancing,
]);

/** 网站宽度 */
export const mainWidth = 1000;
/** 右侧边栏宽度 */
export const articleWidth = 750;
/** 右侧边栏挂件间隔 */
export const asideMarginLeft = 20;
/** 文章主体和顶栏的空隙高度 */
export const headerBodyMargin = 20;
/** 默认字体大小 */
export const FontDefaultSize = 14;
/** 移动端判断 */
export const mediaPhone = `@media only screen and (max-width: ${mainWidth}px)`;
/** PC 端判断 */
export const mediaPc = `@media only screen and (min-width: ${mainWidth}px)`;
/** 标题元素选择器 */
export const getHeadSelector = (pre = '') => {
  return Array(5).fill(0).map((_, i) => `${pre}h${i + 1}`).join(',');
};
