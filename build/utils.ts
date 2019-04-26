import { loader } from 'mini-css-extract-plugin';

/**
 * Generate tag of build
 * @returns {string}
 */
function buildTag() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
}

/** 当前版本号 */
export const version = buildTag();

/** 生成 css loader */
export const cssLoader = () => [
    process.env.NODE_ENV === 'development' ? 'style-loader' : loader,
    'css-loader',
];
