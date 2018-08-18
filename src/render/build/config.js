const { resolve } = require('./utils');

/** 静态资源 */
exports.assert = resolve('assets/');
/** 构建输出的文件路径 */
exports.output = resolve('../../dist/render');
/** 调试时的公共路径 */
exports.publicPath = '';
