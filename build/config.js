const { join } = require('path');

/**
 * 定位到项目根目录
 * @param {string} dir 路径
 */
const resolveRoot = (dir) => join(__dirname, '../', dir);

/**
 * 定位到主进程模块目录
 * @param {string} dir 路径
 */
const resolveMain = (dir) => join(__dirname, '../src/main/', dir);

/**
 * 定位到渲染模块目录
 * @param {string} dir 路径
 */
const resolveRender = (dir) => join(__dirname, '../src/render/', dir);

exports.resolveRoot = resolveRoot;

/** 调试时的网络端口 */
exports.devHttpPort = 9090;

/** 渲染模块配置 */
exports.render = {
    /** 定位到渲染模块目录 */
    resolve: resolveRender,
    /** 静态资源 */
    assert: resolveRender('assets/'),
    /** 构建输出的文件路径 */
    output: resolveRoot('dist/render'),
    /** 公共资源输出路径 */
    publicPath: '',
};

/** 主进程模块配置 */
exports.main = {
    /** 定位到主进程模块目录 */
    resolve: resolveMain,
    /** 静态资源 */
    assert: resolveMain('assets/'),
    /** 构建输出的文件路径 */
    output: resolveRoot('dist/main'),
    /** 公共资源输出路径 */
    publicPath: '',
};
