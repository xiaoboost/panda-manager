const { join, extname } = require('path');
const { loader } = require('mini-css-extract-plugin');

/**
 * Generate tag of build
 * @returns {string}
 */
exports.createBuildTag = function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
};

/** 生成 css loader */
exports.cssLoader = function() {
    return [
        process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : loader,
        'css-loader',
    ];
};

/**
 * 内存中间件
 * @param {object} fs 文件系统
 * @param {string} 文件根目录
 */
exports.ramMiddleware = function(fs, root) {
    return function middleware(ctx, next) {
        if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
            ctx.status = 405;
            ctx.length = 0;
            ctx.set('Allow', 'GET, HEAD');
            next();
            return (false);
        }

        const filePath = ctx.path[ctx.path.length - 1] === '/'
            ? join(root, ctx.path, 'index.html')
            : join(root, ctx.path);

        if (!fs.existsSync(filePath)) {
            ctx.status = 404;
            ctx.length = 0;
            next();
            return (false);
        }

        const fileStat = fs.statSync(filePath);

        ctx.type = extname(filePath);
        ctx.lastModified = new Date();

        ctx.set('Accept-Ranges', 'bytes');
        ctx.set('Cache-Control', 'max-age=0');

        // node-fs
        if (fileStat.size) {
            ctx.length = fileStat.size;
        }
        // memory-fs
        else {
            ctx.length = Buffer.from(fs.readFileSync(filePath)).length;
        }

        ctx.body = fs.createReadStream(filePath);
        next();
    };
};
